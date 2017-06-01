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
}

var alreadyAnswered = Object.keys(Questions);
var currentQuestion;
var currentProps;
var currentAnswer;
var guess;
var timed = false;

//Shorthand random number generator for clarity
function randomNum(num) {
	return Math.floor(Math.random() * num);
}

//Produces random property from input object
function randomProperty(obj) {
	var tmpList = alreadyAnswered;
	var randomPropertyName = tmpList[randomNum(tmpList.length)];
	alreadyAnswered.splice(alreadyAnswered.indexOf(randomPropertyName), 1);
	return obj[randomPropertyName];
}

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
			}
			//Iterate through properties of current question and update html with values
			$(ansOrder[currentIndex]).text(currentQuestion[ currentProps[index] ]);
			ansOrder.splice(currentIndex, 1);
		});

		// $("#question").text(currentQuestion.question);
		// $(ansOrder[currentAns]).text(currentQuestion.correct);
		ansOrder.pop();
		// currentAns = randomNum(ansOrder);
}

function questionTimer(seconds) {
	$("#timer").css("width", "");
	//Input animation for time left here
		$("#timer").animate({width: "0"}, seconds * 1200);
	//
	var time = 0;
	var timer = setInterval(function() {
		time++;
		if (time === seconds * 100) {
			timed = true;
			correctCheck();
		}
	}, 10);

};

function correctCheck(correct) {
	$(".guess").prop("disabled", true);
	clearInterval(timer);
	$("#timer").stop();
	 
	if (guess == $(currentAnswer).attr("id")) {
		console.log("You don't suck!");
	} else if (timed) {
		timed = false;
		console.log("Timed Out");
		//timed out
	} else if (!correct) {
		console.log("Incorrect");
		//incorrect
	}


}

//Main function to manage operation of trivia -- timer is in seconds for question delay
function triviaOperator() {


	questionTimer(8);
	randomQuestion();
	$(".guess").on("click",function() {
		guess = $(this).attr("id");
		correctCheck();
	})
	// if
	// setTimeout();

	
}





$(document).ready(function() {
	$("#start").on("click",function() {
		$("#start").css("display", "none");
		setTimeout(triviaOperator, 2500);
	})


})

