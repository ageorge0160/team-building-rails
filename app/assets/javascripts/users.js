$(document).ready(function() {
  $(".activityForm").hide()
  $(".showActivity").hide()

  $("#create_link").on("click", function(event){
    event.preventDefault()
    $(".activityForm").toggle();
  })

  $('.link').on("click", function() {
    event.preventDefault()
    $(".showActivity").show()
    var activityId = parseInt($(this).attr("data-id"));
    var userId = parseInt($("#username").attr("data-id"));
    $.get("/users/" + userId + "/activities/" + activityId + ".json", function(data) {
      $(".title").text(data["title"]);
      $(".description").text(data["description"]);
      $(".goal").text(data["goal"]);
      $(".rules").text(data["rules"]);
      $(".time").text(data["time"]);
      $(".category").text(data["category"]["name"]);
    });
  })

  $('.submit').on("click", function(event) {
    event.preventDefault()
    var activity = $("form").serialize()
    var activities = $.post("/activities", activity, null, "json").done(function(data) {
      newActivity = new Activity(data.id, data.title, data.description, data.goal, data.rules, data.time, data.category_id, data.topics_attributes )
      newActivity.formatShow()
      fetch(`/users/${data.user.id}.json`).then(res => res.json()).then(newActivity => {
        $('#activity_list').append(activityHtml)
      })
    }).fail(function(data){
      debugger
    })
  })
})

function Activity(id, title, description, goal, rules, time, category_id, topics_attributes) {
  this.id = id
  this.title = title
  this.description = description
  this.goal = goal
  this.rules = rules
  this.time = time
  this.category_id = category_id
  this.topics_attributes = topics_attributes
}

Activity.prototype.formatShow = function() {
  var userId = parseInt($("#username").attr("data-id"));
  var activityHtml = `
  <li><a class='link' data-id="${this.id}" href="/users/${userId}/activities/${this.id}">${this.title}</a><br></li>
  `
  return activityHtml
}
