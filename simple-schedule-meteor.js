if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    slots: [
      { text: "This is slot 1" },
      { text: "This is slot 2" },
      { text: "This is slot 3" }
    ]
  });
}