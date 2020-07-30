// document.querySelector('.card').addEventListener('click', (e)=> {
//     e.target.classList.remove('back');
//     e.target.classList.add('hK');
// })

/*----- constants -----*/
const audioPlayer= new Audio ('/audio/place_card.mp3');
const track={
    cardsound:'/audio/place_card.mp3',
    chipsound:'/audio/poker_chip_dropping.mp3',

}
/*----- app's state (variables) -----*/
let betValue=[];
let betSum=0;
let totalMoney=0;
let playerCards=[];
let computerCards=[];
let numOfRounds=0;
let cardToDisplay='';
let conversionComplete=false;
let playerSum=0;
let computerSum=0;
let playerName= "";
let windowWidth=$(document).width();
let sound=true;


/*----- cached element references -----*/
const dealButton=document.querySelector('button[value="deal"]');
const hitButton=document.querySelector('button[value="hit"]');
const stayButton=document.querySelector('button[value="stay"]');
const doubleButton=document.querySelector('button[value="double"]');
const splitButton=document.querySelector('button[value="split"]');
const restartButton=document.querySelector('#restart');
const soundButton=document.querySelector('#audioControl');

const displayOnTable=document.querySelectorAll('.displayOnTable');
// const playerDisplayText=document.querySelectorAll('.playerDisplayText');
// const computerDisplayText=document.querySelectorAll('.computerDisplayText');

const alertBanner=document.querySelector('#alert');
const mainSection= document.querySelector('main');
const footerSection= document.querySelector('footer');
const inputsSection =document.querySelector('.inputs');
const pCardText= document.querySelector('#pCardTotal');
const cCardText= document.querySelector('#cCardTotal');
const totalPotText= document.querySelector('#totalPot');
const bet1Dollar= document.querySelector('img[alt="$1 Chip"]');
const bet5Dollar= document.querySelector('img[alt="$5 Chip"]');
const bet10Dollar= document.querySelector('img[alt="$10 Chip"]');
const bet25Dollar= document.querySelector('img[alt="$25 Chip"]');
const betChips1= document.querySelector('img[alt="Chip Pile 1"]');
const betChips2= document.querySelector('img[alt="Chip Pile 2"]');
const betChips3= document.querySelector('img[alt="Chip Pile 3"]');
const chipPile= document.querySelectorAll('.chipPile');






/*----- event listeners -----*/
$('#restart').click(gameInit);
document.querySelector('nav').addEventListener('click', initLoad);
splitButton.addEventListener('click',splitMe);
dealButton.addEventListener('click',dealMe);
stayButton.addEventListener('click',stay);
hitButton.addEventListener('click',hitMe);
doubleButton.addEventListener('click',doubleDown);
soundButton.addEventListener('click',setAudio);

bet1Dollar.addEventListener('click',function(){addBet([1]);});
bet5Dollar.addEventListener('click',function(){addBet([5]);});
bet10Dollar.addEventListener('click',function(){addBet([10]);});
bet25Dollar.addEventListener('click',function(){addBet([25]);});
betChips3.addEventListener('click',removeBet);
betChips2.addEventListener('click',removeBet);
betChips1.addEventListener('click',removeBet);


$(document).ready(function(){
    animateTarget('.init2',5000);
});

// function animateTarget(target, speed, prevTop, prevLeft){
//     $(target).css({top:prevTop, left:prevLeft});
//     let t= getRandomNum(-100,100);
//     let s= getRandomNum(-100,100);
//     // let newTop= prevTop+$(document).height() + t;
//     // let newLeft= prevLeft+$(document).width() + s
//     console.log(t,"and",s, "and",$(document).height());
//     $(target).animate(
//     {
//         top: t,
//         left: s
//     },
//     {
//         duration: speed,
//         complete: function(){animateTarget(this,speed,t,s);}
//     }
//     );
// };
function setAudio(){
    if (sound==true){
        sound = false;
        console.log("i am in sound is true");
    } else{
        sound = true;
        console.log("i am in sound is false");
    }
}

function playAudio(name){
    if (sound==true){
        // audioPlayer.src=track[name];
        // audioPlayer.play();
    }
}

function animateTarget(target, speed){
    //move back to start if out of bounds
    let position = $(target).position();
    if(position.left >= windowWidth){
        $(target).css({left:'-200px'});
    };
    //animation
    $(target).animate(
    {
        left: windowWidth + 200
    },
    {
        duration: speed,
        complete: function(){animateTarget(this,speed);}
    }
    );
};

/*----- functions -----*/
function initLoad(){
    document.querySelector('nav').removeEventListener('click',initLoad,false);
    document.querySelector('nav').classList.add('hidden');
    gameInit();
}

function gameInit(){
    // document.querySelector('body').removeEventListener('click', gameInit, false);
    playerName=prompt("Enter Player Name");
    if (playerName!==null && playerName!==""){
        playerName=playerName;
    } else{
        playerName="Player 1";
    }
    document.querySelector('#playerName').innerHTML=playerName;
    totalMoney=200;
    pCardText.innerHTML="";
    cCardText.innerHTML="";
    $('main').addClass('bg2');
    mainSection.classList.remove('hidden');
    footerSection.classList.remove('hidden');
    newRound();
}

function newRound(){
    //console.log('total Money is '+totalMoney);
    //unfreeze screen
    displayOnTable.forEach(function(evt){evt.classList.add('hidden')});
    inputsSection.classList.remove('freeze');
    restartButton.classList.remove('freeze');
    mainSection.classList.remove('overlay');
    chipPile.forEach(function(evt){evt.classList.remove('freeze')});

    mainSection.removeEventListener('click', newRound, false);
    pCardText.innerHTML="";
    cCardText.innerHTML="";
    betChips3.classList.add('hidden');
    betChips2.classList.add('hidden');
    betChips1.src="img/chip1.png";

    //reset round
    betValue=[0, 1];
    betSum=sumOfArray(betValue);
    console.log('sum is '+betSum)
    totalMoney=totalMoney-betSum;
    computerCards=[];
    playerCards=[];

    //display $
    $('#betAmount').text(betSum);
    totalPotText.innerHTML=totalMoney;

    //Remove all cards
    for (let i=1; i<11; i++){
        j="#pCard" + i;
        k="#cCard"+i;
        $(j).fadeOut();
        $(j).removeClass();
        $(j).addClass('card large');
        $(k).fadeOut();
        $(k).removeClass();
        $(k).addClass('card large');
    }
    alertBanner.innerHTML="Place your Bet and Click Deal";
    stayButton.disabled=true;
    hitButton.disabled=true;
    doubleButton.disabled=true;
    dealButton.disabled=false;
}

function dealMe(){
    if (betSum>0){
        chipPile.forEach(function(evt){evt.classList.add('freeze')});
        for (let i=0; i<4; i++){
            if (i==0){
                dealNewCard('p');
            } else if (i==1){
                setTimeout(function(){dealNewCard('c');displayOnTable.forEach(function(evt){evt.classList.remove('hidden')});}, 1000);
                // setTimeout(function(){displayOnTable.forEach(function(evt){evt.classList.remove('hidden')});}, 1000);
                
            } else if (i==2){
                setTimeout(function(){dealNewCard('p')}, 2000);
            } else if (i==3){
                setTimeout(function(){dealNewCard('c');}, 3000);
                setTimeout(function(){
                    if (playerSum == 21){
                        alertBanner.innerHTML="BlackJack!!!"
                        computerTurn();
                    } else{
                        alertBanner.innerHTML="Stay or Hit?";
                    }
                },3500);
            } 
        }
        dealButton.disabled=true;
        hitButton.disabled=false;
        stayButton.disabled=false;
        doubleButton.disabled=false;
        numOfRounds=1;
    } else{
        alertBanner.innerHTML="Min $1 to Play";
    }

}

function dealNewCard(whosTurn){
    playAudio('cardsound');
    conversionComplete=false;
    let cardVal= getRandomNum (2,11);
    let newCard=convertNumToCard(cardVal);
    cardToDisplay='';
    if (whosTurn=='p'){
        playerCards.push(cardVal);
        cardToDisplay= '#pCard' +playerCards.length;
        playerSum = sumOfCards(playerCards);
        pCardText.innerHTML=playerSum;
    } else if (whosTurn=='c'){
        if (computerCards.length==0){
            cardVal=0;
            newCard=convertNumToCard(cardVal);
            computerCards.push(cardVal);
            cardToDisplay= '#cCard1';
        } else if (computerCards.length>1 && computerCards[0]==0){
            computerCards[0]=cardVal;
            cardToDisplay='#cCard1';
            $(cardToDisplay).removeClass('back');
        } else {
            computerCards.push(cardVal);
            cardToDisplay= '#cCard'+computerCards.length;
        }
        computerSum = sumOfCards(computerCards);
        cCardText.innerHTML=computerSum;
    }  else {
        alert("Error in Deal New Card, Game reset");
        gameInit();
    }
    //display New Card 
    //console.log("playerCard.length is "+playerCards.length);
    //console.log("computerCard.length is "+computerCards.length);
    $(cardToDisplay).fadeIn();
    $(cardToDisplay).addClass(newCard);
    //console.log(cardToDisplay);
    return true;
}

function hitMe(){
    numOfRounds++;
    let functionComplete = dealNewCard('p');
    if (functionComplete){
        if (playerSum>21){
            dealerWins();
        } else if (playerSum==21){
            alertBanner.innerHTML="BlackJack!!!"
            computerTurn();
        } else{
            alertBanner.innerHTML="Stay or Hit?"
        }
    }   
    doubleButton.disabled=true;
}

function computerTurn(){
    let keepGoing=true;
    let functionComplete=dealNewCard('c');
    //let i=0;
    if (functionComplete){
        while (keepGoing==true){
            if (computerSum<16 && computerSum<playerSum){
                //keepGoing = setTimeout(function(){ dealNewCard('c')},1000);
                keepGoing=dealNewCard('c');
            } else if (computerSum>=16 && computerSum<21 && computerSum<playerSum){
                keepGoing=dealNewCard('c');
            } else if (computerSum==playerSum){
                keepGoing=false;
                aDraw();
            } else if (computerSum>21){
                keepGoing=false;
                playerWins();
            } else {
                keepGoing=false;
                dealerWins();                
            }
            //i++;
            
        }
    }


}

//winner conditions
function dealerWins(){
    if (playerSum>21){
        alertBanner.innerHTML="Busted, Dealer Wins."
    } else{
        alertBanner.innerHTML="Dealer Wins."
    }
    roundComplete();
}

function playerWins(){
    if (playerSum==21){
        totalMoney=totalMoney+2.5*betSum;
        alertBanner.innerHTML=`You Win $${betSum*1.5}`;
    } else{
        totalMoney=totalMoney+betSum*2
        alertBanner.innerHTML=`You Win $${betSum}`;
    }
    roundComplete();
}

function aDraw(){
    alertBanner.innerHTML="It is a Draw."
    totalMoney=totalMoney+betSum;
    roundComplete();
}

function stay(){
    doubleButton.disabled=true;
    computerTurn();
}

function doubleDown(){
    addBet(betValue);
    
    hitMe();
}

function addBet(y){
    if (totalMoney>sumOfArray(y)){
        // playAudio('chipsound');
        betValue=betValue.concat(y);
        let i=betValue.length;
        betChips1.src="./img/chip"+betValue[i-3]+".png"
        betChips2.src="./img/chip"+betValue[i-2]+".png"
        betChips3.src="./img/chip"+betValue[i-1]+".png";
        /////array not joining
        totalMoney=totalMoney+betSum;
        betSum=sumOfArray(betValue);
        totalMoney=totalMoney-betSum;
        //betValue=betValue+x;
        $('#totalPot').text(totalMoney);
        $('#betAmount').text(betSum); 
    } else{
        alertBanner.innerHTML="Boo! We don't lend money..."
    }
    chipDisplay();    
}

function chipDisplay(){
    if (betValue.length==1){
        betChips3.classList.add('hidden');
        betChips2.classList.add('hidden');
        betChips1.src="img/chip_blank.png";
        alertBanner.innerHTML="Min $1 to Play";
        console.log("l is 1");
    } else if (betValue.length==2){
            betChips3.classList.add('hidden');
            betChips2.classList.add('hidden');
        betChips1.src="img/chip"+betValue[1]+".png";
        betChips1.classList.remove('hidden');
        alertBanner.innerHTML="Place your Bet and Click Deal";
        console.log("l is 2");
    } else if (betValue.length==3){
            betChips3.classList.add('hidden');
        betChips2.src="img/chip"+betValue[2]+".png";
        betChips2.classList.remove('hidden');
        betChips1.src="img/chip"+betValue[1]+".png";
        betChips1.classList.remove('hidden');
        console.log("l is 3");
    } else{
        betChips3.classList.remove('hidden');
        betChips2.classList.remove('hidden');
        betChips1.classList.remove('hidden');
        console.log("l is >3");
    }
}

function removeBet(){
    if (betValue.length>1){
        playAudio('chipsound');
        betChips3.src=betChips2.src;
        betChips2.src=betChips1.src
        betChips1.src="img/chip"+betValue[betValue.length-4]+".png";
        totalMoney=totalMoney-betValue[betValue.length-1];
        betValue.pop();
        betSum=sumOfArray(betValue);
        $('#totalPot').text(totalMoney);
        $('#betAmount').text(betSum); 
    }
    chipDisplay();
    
}

function splitMe(){
    console.log("playerCard is " + playerCards);
    console.log("playerSum is " + playerSum);
    console.log("computerCard is " + computerCards);
    console.log("computerSum is " + computerSum);
    //roundComplete();
    //document.querySelector('body').addEventListener('dblclick', gameInit);

}

//choose a random number
function getRandomNum (min,max){
    min= Math.ceil(min);
    max= Math.floor(max)
    return Math.floor(Math.random()*(max - min + 1))+min;
}

function convertNumToCard(cardVal){
    let newCard ='';
    let i= getRandomNum(1,4);
    if (cardVal=='1'){ newCard= 'dA'}
    else if (cardVal=='2'){ newCard= 'd02'}
    else if (cardVal=='3'){ newCard= 'd03'}
    else if (cardVal=='4'){ newCard= 'd04'}
    else if (cardVal=='5'){ newCard= 'd05'}
    else if (cardVal=='6'){ newCard= 'd06'}
    else if (cardVal=='7'){ newCard= 'd07'}
    else if (cardVal=='8'){ newCard= 'd08'}
    else if (cardVal=='9'){ newCard= 'd09'}
    else if (cardVal=='10'){ 
        let j= getRandomNum(1,4)+9;
        if (j==10){newCard= 'd10'}
        else if (j==11){newCard= 'dJ'}
        else if (j==12){newCard= 'dQ'}
        else if (j==13){newCard= 'dK'}
    }
    else if (cardVal=='11'){ newCard= 'dA'}
    else if (cardVal=='12'){ newCard= 'dQ'}
    else if (cardVal=='13'){ newCard= 'dK'}
    else if (cardVal=='0'){ newCard= 'back'}
    else{ alert(`Card Value is out of range`)}
    conversionComplete=true;
    return newCard;
}

function sumOfCards(arrayX){
    let sum = arrayX.reduce((a,b) => a+b,0);
    let findEleven=arrayX.findIndex(x=>x==11);

    //loop until if sum > 21 and there is no 11
    while (sum>21 && findEleven!=-1){
        arrayX[findEleven]=1;
        findEleven=arrayX.findIndex(x=>x==11);
        sum = arrayX.reduce((a,b) => a+b,0);
    }

    return sum;

}

function sumOfArray(arrayX){
    console.log('Bet Value array is ' +arrayX)
    return arrayX.reduce((a,b) => a+b,0);
}

function roundComplete(){
    inputsSection.classList.add('freeze');
    restartButton.classList.add('freeze');
    mainSection.classList.add('overlay');
    if ( mainSection.classList.contains('overlay')){
        mainSection.addEventListener('click', newRound);
    }

}

//alert ($('button').prop('value'));
//alert (document.querySelector('button').value);
//roundComplete()

//$('input[type="button"][value="restart"]').click(gameInit);
/////audio

/////img overlay with opacity for fireworks
