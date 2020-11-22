document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // code below is buggy, when if statement is removed, the different email inboxes can't be loaded
  if (document.querySelector('#email-entry')) {
    document.querySelector('#email-entry').addEventListener('click', retrieve_email_details, false);
  }
  
  // Compose & send an email
  document.querySelector('#compose-form').onsubmit = send_email; //document.querySelector('#submit').addEventListener('click', send_email); //document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');

});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none'; 

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  const emails_view = document.querySelector('#emails-view');

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    //console.log(emails);
    emails.forEach(create_email_entry);
    //emails.forEach(retrieve_email_details);
  });
  
  return false;
}


function load_email_entry(email_id) {

  const element = document.createElement('div');
  element.innerHTML = "sample text";

  document.querySelector('#emails-view').append(element);

  return false;
}


function retrieve_email_details(email_id) { 
  //fetch(`/emails/${email_id}`)
  fetch('/emails/1')
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      // ... do something else with email ...
  });

  return false;
}  


function create_email_entry_2(item) {
  item.onclick = load_email_entry(item.id);
}


function create_email_entry(item) {
  const element = document.createElement('div');
  element.innerHTML =  "<div>" + item.sender + "  " + item.subject + "  " + item.timestamp + "  " + item.id + "<div>";
  element.style.border = "medium groove #0000FF";
  element.style.borderRadius = "5px";
  if (item.read) {
    element.style.backgroundColor = "grey";
  } else {
    element.style.backgroundColor = "white";
  }
  //element.innerHTML += '<a href="'+desiredLink+'">'+desiredText+'</a>'; https://stackoverflow.com/questions/4772774/how-do-i-create-a-link-using-javascript
  element.style.cursor = "pointer";
  // http://www.javascripter.net/faq/stylesc.htm#:~:text=To%20set%20or%20change%20the,in%20that%20element's%20HTML%20tag.)
  element.id = "email-entry";

  //element.onclick = load_email_entry(item.id);

  //element.onclick = retrieve_email_details(item.id); 
  // https://www.w3schools.com/jsref/event_onclick.asp

  //element.style.borderRadius = "25px";
  //element.innerHTML =  "<div style=\"border-radius: 25px\">" + item.body + "<div>";
  document.querySelector('#emails-view').append(element);
  
}


function send_email() {
  // access the contents of the email
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: document.querySelector('#compose-recipients').value,
        subject: document.querySelector('#compose-subject').value,
        body: document.querySelector('#compose-body').value

    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      console.log(result.message);

      if (result.error) {
        // 
      } else {
        // load the "Sent" mailbox
        load_mailbox('sent');
      }

  });

  return false;

  // refer to this guy's solution: https://github.com/Mukheem1603/mail/blob/master/mail/static/mail/compose.js
  // on second thought, this one looks bad, refer to the reddit one instead
  // https://www.reddit.com/r/cs50/comments/iufijy/cs50w_project_3_mail/
  // helpful link when debugging: https://daveceddia.com/unexpected-token-in-json-at-position-0/
  
}
