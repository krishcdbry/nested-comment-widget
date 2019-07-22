let comments = [];
let commentList = document.getElementById('comments-list');
let oldIdx = 0;

const _getRandomID = () => {
  oldIdx = (new Date()).getTime()+oldIdx+1;
  return oldIdx;
}

const _updateStore = (comments) => {
  window.localStorage.setItem('comments', JSON.stringify(comments));
}

const _prepareCommentObj = (comment) => {
  return {
    comment,
    user : 'user',
    id : _getRandomID(),
    reply : []
  }
}

const _prepareCommentBox = (commentId, replyDivId) => {
  let commentBox = document.createElement('DIV');
  let textarea = document.createElement('TEXTAREA');
  let button = document.createElement('BUTTON');

  textarea.className = "reply-box";
  
  let commentBoxId = _getRandomID();
  commentBox.id = commentBoxId;
  button.innerHTML = "Reply";
  button.style.display = "block";
  button.addEventListener('click', () => {
    let reply = textarea.value;
    addReply(reply, commentId, replyDivId);
    commentBox.parentNode.removeChild(commentBox);
  });

  commentBox.appendChild(textarea);
  commentBox.appendChild(button);
  return commentBox;
}

const _prepareComment = (commentObj) => {

  const {id, user, comment, reply} = commentObj;

  let commentDiv = document.createElement('DIV');
  let authorDiv = document.createElement('DIV');
  let messageDiv = document.createElement('DIV');
  let replyButton = document.createElement('A');
  let replyDiv = document.createElement('DIV');

  commentDiv.id = id;
  commentDiv.className = "comment-item";

  authorDiv.innerHTML = user;
  authorDiv.className = "Javascript Ninja";

  messageDiv.innerHTML = comment;
  messageDiv.className = "comment";

  replyDiv.className = "replies";
  let replyDivId = _getRandomID();
  replyDiv.id = replyDivId;

  replyButton.innerHTML = "Reply";
  replyButton.style.display = "block";
  replyButton.href = "javascript:;";
  replyButton.className = "reply";
  replyButton.addEventListener('click', () => {

    let element = replyButton.previousElementSibling;

    if(element.className == 'comment') {
        // Open text box
        let commentBox = _prepareCommentBox(id, replyDivId);
        commentDiv.insertBefore(commentBox, replyButton);
    }
    
  })

  commentDiv.appendChild(authorDiv);
  commentDiv.appendChild(messageDiv);
  commentDiv.appendChild(replyButton);

  // Adding replies
  if (reply.length > 0) {
    for (let key in reply) {
      let comment = reply[key];
      let commentDiv = _prepareComment(comment);
      replyDiv.appendChild(commentDiv);
    }
  }

  commentDiv.appendChild(replyDiv);

  return commentDiv;
}


function iterateComments(comments, reply, commentId) {
  return comments.map(item => {
    if (item.id === commentId) {
      item.reply.push(reply);
    }
    else {
      item.reply = iterateComments(item.reply, reply, commentId);
    }
    return item;
  })
}

function renderComment(comment) {
  let commentElement = _prepareComment(comment);
  commentList.appendChild(commentElement);
}

function renderReply(reply, replyDivId) {
  let replyElement = _prepareComment(reply);
  document.getElementById(replyDivId).appendChild(replyElement);
}

function addReply(reply, commentId, replyDivId) {
  let replyObj = _prepareCommentObj(reply);
  comments = iterateComments(comments, replyObj, commentId);
  renderReply(replyObj, replyDivId)
  _updateStore(comments);
}

function addComment() {
  let comment = document.getElementById('comment-box').value;
  let commentObj = _prepareCommentObj(comment);
  comments.push(commentObj);
  renderComment(commentObj);
  _updateStore(comments);
}


function _init() {
  if (!window.localStorage.getItem('comments')) {
    window.localStorage.setItem('comments', JSON.stringify([]));
  }

  comments = JSON.parse(window.localStorage.getItem('comments'));

  console.log(comments); 

  commentList = document.getElementById('comments-list');

  for (let key in comments) {
    let comment = comments[key];
    renderComment(comment);
  }
}

_init();



