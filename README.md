# BlackJack Casino Game
___
## Description
The player first enters the game's initial page, which contains fun background music with a casino image. Clicking the "sound button" initiates the music. Click anywhere on the casino image would take you to the BlackJack game.

The player enters this game with the input of his/her name. The game presents the player with total money of \$200 and an initial bet of \$1. Standard rules of BlackJack applies.

The player can then add or subtract bet amount by clicking the chips. The player also has the option to start a new game or control sound with buttons on the top left of the screen.

## Screen shots of the game
> **_Inital Loading Page_**

![Inital Loading Screen](https://i.imgur.com/pegfwZg.png)

> **_BlackJack Table Page_**

![Inital Loading Screen](https://i.imgur.com/ZC2Yme0.jpeg)

## Technologies Used
* HTML
* CSS
* Bootstrap
* JavaScript
* jQuery

## Game Rules
Player is dealt with two cards, face up The dealer is also dealt two cards, one up (exposed) and one down (hidden). 

The value of cards two through ten is their pip value (2 through 10). Face cards (Jack, Queen, and King) are all worth ten. Aces can be worth one or eleven. 

A hand's value is the sum of the card values. Players are allowed to draw additional cards to improve their hands. A hand with an ace valued as 11 is called "soft", meaning that the hand will not bust by taking an additional card. The value of the ace will become one to prevent the hand from exceeding 21. Otherwise, the hand is called "hard".

Once the player has completed his/her hands, it is the dealer's turn. The dealer hand will not be completed if the player has been busted or received blackjacks. The dealer then reveals the hidden card and must hit until the cards total up to 17 points. At 17 points or higher the dealer must stay. 

You are betting that you have a better hand than the dealer. The better hand is the hand where the sum of the card values is closer to 21 without exceeding 21. The detailed outcome of the hand follows:
* If the player is dealt an Ace and a ten-value card (called a "blackjack" or "natural"), and the dealer does not, the player wins and receives double the pot.
* If the player exceeds a sum of 21 ("busts"); the player loses automatically.
* If the dealer exceeds 21 ("busts") and the player does not; the player wins.
* If the player attains a final sum higher than the dealer and does not bust; the player wins.
* If both dealer and player receive a blackjack or any other hands with the same sum called a "push", no one wins.

For detail rules, please checkout [BlackJack](https://en.wikipedia.org/wiki/Blackjack) on wikipedia. 

## Future Enhancements
* The game logic was built based on randomly selecting numbers. Depending on the casino rules, the game should be changed to selecting cards from one or two full decks of cards and re-shuffle after several rounds.
* The split function.
* Addition of media queries to apply different styles for different media types/devices.


