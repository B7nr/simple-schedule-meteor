
Slots = new Mongo.Collection("slots");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    slots: function () {
        if (Session.get("hideCompleted")) {
            // If hide completed is checked, filter tasks
            return Slots.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
        } else {
            // Otherwise, return all of the tasks
            return Slots.find({}, {sort: {createdAt: -1}});
        }
    },
      hideCompleted: function () {
          return Session.get("hideCompleted");
      },
      incompleteCount: function () {
          return Slots.find({checked: {$ne: true}}).count();
    }
  });
    Template.calender.helpers({
        slottime: function() {
            return moment(this.date).format('l LT')
        }
    });

// Adding slots with a form
  Template.body.events({
    "submit .new-task": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      // Insert a task into the collection
        Meteor.call("addSlot", text);

      // Clear form
      event.target.text.value = "";
    },
      "change .hide-completed input": function (event) {
          Session.set("hideCompleted", event.target.checked);
    }
  });
    Template.calender.events({
        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Meteor.call("setChecked", this._id, ! this.checked);
        },
        "click .delete": function () {
        Meteor.call("deleteSlot", this._id);
        }
    });

    Accounts.ui.config({
        passwordSignupFields: "USERNAME_ONLY"
    });
}

Meteor.methods({
    addSlot: function (date) {
        // Make sure the user is logged in before inserting a task
        if (! Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        Slots.insert({
            date: moment(date).format('l LT'),
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    deleteSlot: function (taskId) {
        Slots.remove(taskId);
    },
    setChecked: function (taskId, setChecked) {
        Slots.update(taskId, { $set: { checked: setChecked} });
    }
});


