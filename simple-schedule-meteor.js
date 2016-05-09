
Slots = new Mongo.Collection("slots");
var previousDate = new Date("01-01-2000");

if (Meteor.isClient) {
    // This code only runs on the client
    Template.body.helpers({
        slots: function () {
            if (Session.get("hideCompleted")) {
                // If hide completed is checked, filter tasks
                return Slots.find({checked: {$ne: true}}, {sort: {date: 1}});
            } else {
                // Otherwise, return all of the tasks
                return Slots.find({date: {$gt: new Date()}}, {sort: {date: 1}});
            }
        },
        hideCompleted: function () {
            return Session.get("hideCompleted");
        },
        incompleteCount: function () {
            return Slots.find({checked: {$ne: true}}).count();
        },
        isUserAdmin: function () {
        var adminUser = Meteor.user().username
        if (adminUser === "Admin_Ben") {
            return true;
        }
    }
    });
    Template.calender.helpers({
        slottime: function () {
            return moment(this.date).format('l LT')
        },
        header: function () {
            return moment(this.date).format('l LT')
        },
        disableCheckbox: function () {
            var ownSlot = this.owner === Meteor.userId();
            console.log(this.date - new Date());
            console.log(86400000 > (this.date - new Date()));
            return (!ownSlot && this.owner) || (86400000 > (this.date - new Date()));
        },
        isNewDate: function () {
            var newDate = true;
            console.log('date:' + this.date);
            console.log('previousDate:' + previousDate);
            previousDate = this.date;
            return newDate;
        },
        isUserAdmin: function () {
            var adminUser = Meteor.user().username
            if (adminUser === "Admin_Ben") {
                return true;
            }
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
            Meteor.call("setChecked", this._id, !this.checked);
        },
        "click .delete": function () {
            Meteor.call("deleteSlot", this._id);
        },
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
            date: new Date(date),
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username
        });
    },
    deleteSlot: function (taskId) {
        Slots.remove(taskId);
    },

    setChecked: function (taskId, setChecked) {
        var owner, username;

        if (setChecked) {
            owner =  Meteor.userId();
            username = Meteor.user().username;
        }
        Slots.update(taskId, { $set: { checked: setChecked, owner: owner, username: username } });
    }
});


