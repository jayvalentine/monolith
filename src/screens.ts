import $ from "jquery";

import { game } from "./global"

export function startPrologue() {
  $("#GameStartScreen").hide();
  $("#GameMainScreen").hide();

  $("#PrologueTitle").hide();
  $("#Prologue1").hide();
  $("#Prologue2").hide();
  $("#Prologue3").hide();
  $("#Prologue4").hide();
  $("#PrologueContinue").hide();

  $("#GamePrologueScreen").show();

  $("#PrologueTitle").fadeIn(2000, function () {
    $("#Prologue1").fadeIn(4000, function () {
      $("#Prologue2").fadeIn(4000, function () {
        $("#Prologue3").fadeIn(4000, function () {
          $("#Prologue4").fadeIn(8000, function () {
            $("#PrologueContinue").fadeIn(2000);
          });
        });
      });
    });
  });
}

export function startMainGame() {
  $("#GamePrologueScreen").hide();
  $("#GameStartScreen").hide();
  $("#GameMainScreen").show();
  $("#GameDate").show();

  game.start();
}
