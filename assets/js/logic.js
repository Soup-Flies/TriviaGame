var Questions = {

	q1: {
		question: "How many yada",
		correct: "1correct answer = here",
		wrong1: "1wrong answer = here",
		wrong2: "2wrong answer = here",
		wrong3: "3wrong answer = here"
	},
	q2: {
		question: "How many blada",
		correct: "2correct answer = here",
		wrong1: "4wrong answer = here",
		wrong2: "5wrong answer = here",
		wrong3: "6wrong answer = here"
	},
	q3: {
		question: "How many hippos",
		correct: "3correct answer = here",
		wrong1: "7wrong answer = here",
		wrong2: "8wrong answer = here",
		wrong3: "9wrong answer = here"
	},
	q4: {
		question: "How many trees",
		correct: "4correct answer = here",
		wrong1: "10wrong answer = here",
		wrong2: "11wrong answer = here",
		wrong3: "12wrong answer = here"
	},
	q5: {
		question: "How many elves",
		correct: "5correct answer = here",
		wrong1: "13wrong answer = here",
		wrong2: "14wrong answer = here",
		wrong3: "15wrong answer = here"
	},
	q6: {
		question: "How many dwarves",
		correct: "6correct answer = here",
		wrong1: "16wrong answer = here",
		wrong2: "17wrong answer = here",
		wrong3: "18wrong answer = here"
	},
	q7: {
		question: "How many pickles",
		correct: "7correct answer = here",
		wrong1: "19wrong answer = here",
		wrong2: "20wrong answer = here",
		wrong3: "21wrong answer = here"
	}
};

var alreadyAnswered;
var questionsLeft;
var currentQuestion;
var currentProps;
var currentAnswer;
var guess;
var timer;
var timed = false;
var correctGuess = 0;
var incorrectGuess = 0;
var gameOver = false;


//Shorthand random number generator for clarity
function randomNum(num) {
	return Math.floor(Math.random() * num);
};

//Produces random property from input object without redundancy
function randomProperty(obj) {
	var tmpList = alreadyAnswered;
	var randomPropertyName = tmpList[randomNum(tmpList.length)];
	alreadyAnswered.splice(alreadyAnswered.indexOf(randomPropertyName), 1);
	return obj[randomPropertyName];
};


//Updates html to show selected property from randomProperty
function randomQuestion() {
		currentQuestion = randomProperty(Questions);
		currentProps = Object.keys(currentQuestion);
		var ansOrder = ["#ans1", "#ans2", "#ans3", "#ans4"];
		var currentAns = randomNum(ansOrder);

		//Case handling for current question and currentAnswer
		$.each(currentProps, function(index, value) {
			var currentIndex = randomNum(ansOrder.length);
			if (index === 0) {
				$("#question").text(currentQuestion[ currentProps[index] ]);
				return;
			} else if (index === 1) {
				//Store variable of correct answer to prevent inspection cheating
				currentAnswer = ansOrder[currentIndex];
				console.log(ansOrder[currentIndex]);
			};
			//Iterate through properties of current question and update html with values
			$(ansOrder[currentIndex]).text(currentQuestion[ currentProps[index] ]);
			ansOrder.splice(currentIndex, 1);
		});
};

//Timeout for guesses
function questionTimer(seconds) {
	var time = 0;
	$("#timer").css("width", "");
	//Input animation for time left here NO CLUE why 1200 is magic number?
	$("#timer").animate({width: "0"}, seconds * 1200);
	//Maybe because the bar doesn't visually go to 0 and must compensate
	timer = setInterval(function() {
		time++;
		console.log(time);
		if (time === seconds) {
			clearTimeInterval(timer);
			timed = true;
			correctCheck();
		};
	}, 1000);

};

//Clear running timer
function clearTimeInterval(clearTimer) {
	clearInterval(clearTimer);
	time = 0;
	clearTimer = 0;
};


//Take user click action (or lack thereof) and increment appropriate variables
function correctCheck(correct) {
	
	console.log(questionsLeft);
	$(".guess").prop("disabled", true);
	$("#timer").stop();

	if (questionsLeft.length == 0) {
		gameEnd();
		return;
	};
	
	questionsLeft.pop();

	if (guess == $(currentAnswer).attr("id")) {
		correctGuess++;
		popupController("correct");

	} else if (timed) {
		incorrectGuess++;
		timed = false;
		popupController("timeout");


	} else if (!correct) {
		incorrectGuess++;
		popupController("incorrect");

	};
	setTimeout(triviaOperator, 2500);
};

//Display popup with different outcomes dependent on calling situation
function popupController(reason) {
	$("#main").css("opacity", "0.6");
	var $popup = $("#popup");
		
		switch (reason) {
			case "correct":
				$popup.text("Correct!" + correctGuess);
				break;
			case "incorrect":
			// need correct answer
				$popup.text("Incorrect!" + incorrectGuess);
				break;
			case "timeout":
			//need correct answer
				$popup.text("Timed out" + incorrectGuess);
				break;
			case "start":
				break;
			case "gameover":
				$popup.html("Game is over man! You got " + correctGuess + " right out of " + (incorrectGuess + correctGuess) + "\nPlay Again? <br /><button style='color: black' id='replay'>Replay?</button>");
				break;
			default:
				console.log("Unexpected input to popupController");
		};
	$popup.css("display", "block");
};

//Stop all running pieces and present gameover screen
function gameEnd() {
	gameOver = true;
	clearTimeInterval(timer);
	console.log("Round Over");
	guess = null;
	console.log(correctGuess);
	console.log(incorrectGuess);
	popupController("gameover");
	$("#replay").on("click", function() {
		correctGuess = 0;
		incorrectGuess = 0;
		gameOver = false;
		$("#popup").html("Get ready, here we go!");
		gameStart();
	});

};

//Initial popup to play game
function gameStart() {
	$("#main").css("display", "block");
	alreadyAnswered = Object.keys(Questions);
	questionsLeft = Object.keys(Questions);
	$("#start").css("display", "none");
	setTimeout(function() {
		$("#popup").css("display", "none");
		$("#main").css("opacity", "1");
	},2500);
	setTimeout(triviaOperator, 2500);
};

//Main function to manage operation of trivia
function triviaOperator() {
	$("#main").css("opacity", "1");
	$("#popup").css("display", "none");
	$(".guess").prop("disabled", false);
	questionTimer(8);
	if (questionsLeft.length > 0) {
		randomQuestion();
	};
};

$(document).ready(function() {
	$("#start").on("click", gameStart);
	$(".guess").on("click",function() {
		if (gameOver) {
			$(".guess").prop("disabled", true);
			return;
		};
		clearTimeInterval(timer);
		guess = $(this).attr("id");
		console.log(guess, "guess");
		correctCheck();
	});
});