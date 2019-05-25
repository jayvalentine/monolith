function startPrologue() {
  $("#GameStartScreen").hide();

  $("#PrologueTitle").hide();
  $("#Prologue1").hide();
  $("#Prologue2").hide();
  $("#Prologue3").hide();
  $("#Prologue4").hide();

  $("#GamePrologueScreen").show();

  $("#PrologueTitle").fadeIn(2000, function () {
    $("#Prologue1").fadeIn(4000, function () {
      $("#Prologue2").fadeIn(4000, function () {
        $("#Prologue3").fadeIn(4000, function () {
          $("#Prologue4").fadeIn(8000);
        });
      });
    });
  });
}
