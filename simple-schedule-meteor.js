Slots = new Mongo.Collection("slots");

if (Meteor.isClient) {
  // This code only runs on the client
  Template.body.helpers({
    slots: function () {
      return Slots.find({}, {sort: {createdAt: -1}});
    }
  });
// Adding slots with a form
  Template.body.events({
    "submit .new-slot": function (event) {
      // Prevent default browser form submit
      event.preventDefault();

      // Get value from form element
      var text = event.target.text.value;

      // Insert a task into the collection
      Slots.insert({
        text: text,
        createdAt: new Date() // current time
      });

      // Clear form
      event.target.text.value = "";
    }
  });
    Template.calender.events({
        "click .toggle-checked": function () {
            // Set the checked property to the opposite of its current value
            Slots.update(this._id, {
                $set: {checked: ! this.checked}
            });
        },
        "click .delete": function () {
            Slots.remove(this._id);
        }
    });
}
