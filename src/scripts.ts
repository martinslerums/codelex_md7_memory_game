const gameField = document.querySelector(".js-gameField");
const cardColors: string[] = ["aqua", "gold", "purple"];
let cardColorsPicklist: string[] = [...cardColors, ...cardColors]; // Iespējamās kārtis => 2x no cardcolors []
const cardCount: number = cardColorsPicklist.length;

// Speles stāvoklis

let revealedCards: number = 0;
let activeCard: HTMLDivElement = null; // Kārts uz kuras uzklikšķināts
let awaitingEndOfMove: boolean = false; // Gaidam gājiena beigas, kad 2vas kārtis izvēlētas lai nevar klikšķināt citas kārtis
let countdownStarted: boolean = false; // Flags priekš taimera
let movesMade: number = 0;
let time = 100; // Sākuma laiks.

// Gājieni veikti

const moveCounter = document.querySelector(".moves")
    if (moveCounter) {
        moveCounter.innerHTML = "0"
    }

//Taimeris
const timer = document.querySelector(".time-remaining");
    if(timer) {
        timer.innerHTML = "100"
    }

const countdown = () => {
  if (timer) {
    const countdownInterval = setInterval(() => {
      if (cardCount === revealedCards || time <= 0) {
        clearInterval(countdownInterval); // Laiks tiek apturēts
      }

      timer.textContent = String(time);
      time--;
    }, 1000); // 1000 milliseconds = 1 sec
  }
};
// Izveidojam kārtis.
const buildCard = (element: HTMLDivElement, color: string): HTMLDivElement => {
  element.setAttribute("card-color", color); // Tiks salīdzināti setAttribute card-color ja 2vas kārtis ar same color === match
  element.setAttribute("card-revealed", "false"); // Kad 2vas kārtis ir nomatchotas => tiek noflaggotas ar setAttribute

  element.addEventListener("click", () => {
    const revealed = element.getAttribute("card-revealed");
    // 3 "buggi" 1. Kad 2vas kārtis jau atklātas - lai nevar turpināt klikšķināt 2. Ja kārtis jau ir revealed lai nevar atkal ieklikšķināt 3. Lai nevar atvērt kārti un vēlreiz uz tās uzklikšķināt un nomatchot.
    if (awaitingEndOfMove || revealed === "true" || element === activeCard) {
      return;
    }

    element.style.backgroundColor = color;
    // element.style.backgroundImage = "url('assets/images/playingCard.png')";
    // Uzflago aktīvo kārti pēc klikšķa un palaiž taimeri (For some reason timeris sākas ar nelielu aizkavi)
    if (!activeCard) {
    
      activeCard = element;

      movesMade++;

      if (moveCounter) {
        moveCounter.textContent = String(movesMade);
    }

      if (!countdownStarted) {
        countdownStarted = true;
        countdown();
      }

      return;
    }

    //Salīdzināsim vai previously setAttribute sakrīt. Ja sakrīt tad otru SetAttribute noflago uz true
    const colorToMatch = activeCard.getAttribute("card-color");

    if (colorToMatch === color) {
      activeCard.setAttribute("card-revealed", "true");
      element.setAttribute("card-revealed", "true");

      awaitingEndOfMove = false;
      activeCard = null;
      revealedCards += 2;

      if (revealedCards === cardCount) {
        showOverlay();
      }

      return;
    }
    // Ja krāsas nesakrīt noclearojam flagus un resetojam.
    awaitingEndOfMove = true;

    setTimeout(() => {
      element.style.backgroundColor = null;
      activeCard.style.backgroundColor = null;

      awaitingEndOfMove = false;
      activeCard = null;
    }, 1000);
  });

  return element;
};

// Piešķirsim randomly vienu no 6 krāsām katram div (kārtij) elementam
const cardsArray: Element[] = Array.from(document.querySelectorAll(".js-card"));

for (let i = 0; i < cardCount; i++) {
  const randomIndex: number = Math.floor(
    Math.random() * cardColorsPicklist.length
  );
  const color: string = cardColorsPicklist[randomIndex];

  cardColorsPicklist.splice(randomIndex, 1);

  const currentCard: HTMLDivElement = cardsArray[i] as HTMLDivElement;
  const card: HTMLDivElement = buildCard(currentCard, color);
}

const playAgain = () => {
    // Reload the page
    window.location.reload();
  }

const playAgainButton = document.querySelector('.play-again-button');
    if (playAgainButton) {
    playAgainButton.addEventListener('click', playAgain);
}
  

// Function to show the overlay
const showOverlay = () => {
    const overlay = document.getElementById("overlay");
    if (overlay) {
      overlay.style.display = "flex";
    }
  }
  
