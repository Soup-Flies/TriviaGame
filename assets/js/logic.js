var Questions = {

	q1: {
		question: "According to Greek mythology, who was the goddess of beauty?",
		correct: "Aphrodite",
		wrong1: "Sisyphus",
		wrong2: "Hera",
		wrong3: "Eris"
	},
	q2: {
		question: "What is the name for the Greek goddess of victory?",
		correct: "Nike",
		wrong1: "Hebe",
		wrong2: "Rhea",
		wrong3: "Artemis"
	},
	q3: {
		question: "According to Greek mythology which Gorgon had snakes for hair and could turn onlookers into stone?",
		correct: "Medusa",
		wrong1: "Stheno",
		wrong2: "Euryalle",
		wrong3: "Scylla"
	},
	q4: {
		question: "Poseidon is the god of the sea and...?",
		correct: "Earthquakes",
		wrong1: "Rain",
		wrong2: "Fish",
		wrong3: "Sand"
	},
	q5: {
		question: "Hades is best known for kidnapping which minor Goddess?",
		correct: "Persephony",
		wrong1: "Hacate",
		wrong2: "Isis",
		wrong3: "Demeter"
	},
	q6: {
		question: "Who is Athena's mother in most Mythology?",
		correct: "Nobody she only has a father",
		wrong1: "Aphrodite",
		wrong2: "Hera",
		wrong3: "Metis"
	},
	q7: {
		question: "In one Myth, the God Apollo chases after what nymph?",
		correct: "Daphne",
		wrong1: "Juniper",
		wrong2: "Miranda",
		wrong3: "Artemis"
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
	$("#timer").animate({width: "0"}, seconds * 1100);

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
	
	$(".guess").prop("disabled", true);
	$("#timer").stop();

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

	if (questionsLeft.length == 0) {
		setTimeout(gameEnd, 3500);
		return;
	};

	setTimeout(triviaOperator, 3500);
};

//Display popup with different outcomes dependent on calling situation
function popupController(reason) {
	var $popup = $("#popup");
	var total = correctGuess + incorrectGuess
		
		switch (reason) {
			case "correct":
				$popup.html("Correct!<br> You've gotten:<br>" + correctGuess + " out of " + total + " questions correct." );
				break;
			case "incorrect":
			// need correct answer
				$popup.html("Incorrect! <br> You've missed: " + incorrectGuess + " out of " + total + " answers<br> The correct answer was:<br><strong> " + $(currentAnswer).text()) + "</strong>";
				break;
			case "timeout":
			//need correct answer
				$popup.html("You took too long and the gods became impatient<br> You have now missed " + incorrectGuess + " out of " + total + " answers<br> The correct answer was:<br> <strong>" + $(currentAnswer).text()) + "</strong>";
				break;
			case "start":
				break;
			case "gameover":
				$popup.html("Game Over! <br> You got " + correctGuess + " out of " + (incorrectGuess + correctGuess) + " questions correct!" + "<br /><button style='color: black' class='col-xs-8 col-xs-offset-2 btn btn-default' id='replay'>Replay?</button>");
				break;
			default:
				console.log("Unexpected input to popupController");
		};
	$popup.css("display", "block");
	$(".popupcontainer").css("visibility", "visible");
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
		$(".popupcontainer").css("visibility", "hidden");
	},1500);
	setTimeout(triviaOperator, 1500);
};

//Main function to manage operation of trivia
function triviaOperator() {
	$("#main").css("opacity", "1");
	$("#popup").css("display", "none");
	$(".popupcontainer").css("visibility", "hidden");
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