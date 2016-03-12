Tasks = new Mongo.Collection("slots");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    slots: function () {
      return Tasks.find({});
    }
  });
}