let comments = [];
let commentList = document.getElementById('comments-list');
let oldIdx = 0;

/**
 * Takes care of random ID's
 */
const _getRandomID = () => {
  oldIdx = (new Date()).getTime()+oldIdx+1;
  return oldIdx;
}

/**
 * Takes care of storeupdation
 * @param {*} comments  // List of comments
 */
const _updateStore = (comments) => {
  window.localStorage.setItem('comments', JSON.stringify(comments));
}

/**
 * Prepared a valid comment object
 * @param {*} comment  
 */
const _prepareCommentObj = (comment) => {
  return {
    comment,
    user : 'user',
    id : _getRandomID(),
    reply : []
  }
}

/**
 * Prepare comment box
 * @param {*} commentId   // Comment index
 * @param {*} replyDivId  // Replies element index
 */
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

/**
 * Prepares comment for rendering
 * @param {*} commentObj 
 */
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

/**
 * Loop through comments and updates them
 * @param {*} comments  // Comments list
 * @param {*} reply     // Reply item to be added
 * @param {*} commentId 
 */
function findAndUpdateComments(comments, reply, commentId) {
  return comments.map(item => {
    if (item.id === commentId) {
      item.reply.push(reply);
    }
    else {
      item.reply = findAndUpdateComments(item.reply, reply, commentId);
    }
    return item;
  })
}

/**
 * Renders comment after adding
 * @param {*} comment 
 */
function renderComment(comment) {
  let commentElement = _prepareComment(comment);
  commentList.appendChild(commentElement);
}

/**
 * Renders reply after adding
 * @param {*} reply   // reply object
 * @param {*} replyDivId  // reply div ID
 */
function renderReply(reply, replyDivId) {
  let replyElement = _prepareComment(reply);
  document.getElementById(replyDivId).appendChild(replyElement);
}

/**
 * Adding reply to the comment
 * @param {*} reply      // Reply message
 * @param {*} commentId  // Comment id
 * @param {*} replyDivId  // Reply div id
 */
function addReply(reply, commentId, replyDivId) {
  let replyObj = _prepareCommentObj(reply);
  comments = findAndUpdateComments(comments, replyObj, commentId);
  renderReply(replyObj, replyDivId)
  _updateStore(comments);
}

/**
 * Adding comment
 */
function addComment() {
  let comment = document.getElementById('comment-box').value;
  let commentObj = _prepareCommentObj(comment);
  comments.push(commentObj);
  renderComment(commentObj);
  _updateStore(comments);
}

/**
 * Init function
 */
function _init() {
  if (!window.localStorage.getItem('comments')) {
    window.localStorage.setItem('comments', JSON.stringify([]));
  }

  comments = JSON.parse(window.localStorage.getItem('comments'));
  commentList = document.getElementById('comments-list');

  for (let key in comments) {
    let comment = comments[key];
    renderComment(comment);
  }
}

_init();



