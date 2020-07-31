/*----- constants -----*/
const audioPlayer= new Audio ('audio/place_card.mp3');
const audioInitLoad= new Audio ('audio/around_the_world.mp3');
const track={
    cardsound:'audio/place_card.mp3',
    chipsound:'audio/poker_chip_dropping.mp3',
    winnersound:'audio/winner_clap.mp3',
    loosersound:'audio/looser_boo.mp3',
}

/*----- app's state (variables) -----*/
let betValue=[];
let betSum=0;
let totalMoney=0;
let playerCards=[];
let playerCards2=[];
let computerCards=[];
let numOfRounds=0;
let cardToDisplay='';
let conversionComplete=false;
let playerSum=0;
let playerSum2=0;
let computerSum=0;
let playerName= "";
let windowWidth=$(document).width();
let sound=true;
let soundinit=true;
let split=false;
let double=false;


/*----- cached element references -----*/
const dealButton=document.querySelector('button[value="deal"]');
const hitButton=document.querySelector('button[value="hit"]');
const stayButton=document.querySelector('button[value="stay"]');
const doubleButton=document.querySelector('button[value="double"]');
const splitButton=document.querySelector('button[value="split"]');
const restartButton=document.querySelector('#restart');
const soundButton=document.querySelector('#audioControl');
const initSoundButton = document.querySelector('#audioInitial');

const displayOnTable=document.querySelectorAll('.displayOnTable');
const alertBanner=document.querySelector('#alert');
const mainSection= document.querySelector('main');
const footerSection= document.querySelector('footer');
const inputsSection =document.querySelector('.inputs');

const pCardText= document.querySelector('#pCardTotal');
const pCardText2= document.querySelector('#pCardTotal2');
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
document.querySelector('.onLoadImg').addEventListener('click', initLoad);

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

initSoundButton.addEventListener('click', function(){
    if (soundinit==true){
        audioInitLoad.play();
        initSoundButton.innerHTML="| | Sound";
        soundinit=false;
    } else{
        audioInitLoad.pause();
        initSoundButton.innerHTML="&#9655 Sound";
        soundinit=true;
    }
})

/*----- functions -----*/
function setAudio(){
    if (sound==true){
        sound = false;
        soundButton.innerHTML="&#9655";
        
    } else{
        sound = true;
        soundButton.innerHTML="| |";

    }
}

function playAudio(name){
    if (sound==true){
        audioPlayer.src=track[name];
        audioPlayer.play();
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

function initLoad(){
    audioInitLoad.pause();
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
    //unfreeze screen
    displayOnTable.forEach(function(evt){evt.classList.add('hidden')});
    inputsSection.classList.remove('freeze');
    restartButton.classList.remove('freeze');
    mainSection.classList.remove('overlay');
    stayButton.disabled=true;
    hitButton.disabled=true;
    dealButton.disabled=false;

    mainSection.removeEventListener('click', newRound, false);
    pCardText.innerHTML="";
    cCardText.innerHTML="";
    double=false;
    if (split==true){
        checkSplit();
        splitButton.disabled=false;
        doubleButton.disabled=false;

    } else{
        //Do not perform if split
        chipPile.forEach(function(evt){evt.classList.remove('freeze')});


        //Do not perform if split
        betChips3.classList.add('hidden');
        betChips2.classList.add('hidden');
        betChips1.src="img/chip1.png";

        //reset round,     //Do not perform if split
        betValue=[0, 1];
        betSum=sumOfArray(betValue);
        totalMoney=totalMoney-betSum;
        computerCards=[];
        playerCards=[];

        //display $ //Do not perform if split
        $('#betAmount').text(betSum);
        totalPotText.innerHTML=totalMoney;

        //Remove all cards, //do not perform if split
        for (let i=1; i<11; i++){
            let j="#pCard" + i;
            let k="#cCard"+i;
            // let l="#pCardSplit"+i;
            $(j).fadeOut();
            $(j).removeClass();
            $(j).addClass('card large');
            $(k).fadeOut();
            $(k).removeClass();
            $(k).addClass('card large');
            // $(l).fadeOut();
            // $(l).removeClass();
            // $(l).addClass('card large');
        }

        alertBanner.innerHTML="Place your Bet and Click Deal";

        doubleButton.disabled=true;
        splitButton.disabled=true;
    }
    

    

}

function dealMe(){
    if (betSum>0){
        dealButton.disabled=true;
        hitButton.disabled=false;
        stayButton.disabled=false;
        doubleButton.disabled=false;
        splitButton.disabled=false;

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
                    if (playerSum==21){
                        computerTurn();
                    } else{
                        alertBanner.innerHTML="Stay or Hit?";
                    }
                },3500);
            } 
        }

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
    } else if (whosTurn=='s'){
        //this is split condition    
        playerCards2.push(cardVal);
        cardToDisplay= '#pCardSplit' +playerCards2.length;
        playerSum2 = sumOfCards(playerCards2);
        pCardText2.innerHTML=playerSum;
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
    $(cardToDisplay).fadeIn();
    $(cardToDisplay).addClass(newCard);
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
            if (double==true){
                computerTurn();
            } else{
                alertBanner.innerHTML="Stay or Hit?"
            }
        }
    }   
    doubleButton.disabled=true;
}

function checkSplit(){
    alertBanner.innerHTML="Hit or Stay";
    let onecardClass=document.querySelector('#pCardSplit1').classList;
    let twocardClass=document.querySelector('#pCardSplit2').classList;
    console.log("twocardClass is",twocardClass);
    console.log(document.querySelector('#pCard2').classList);
    document.querySelector('#pCardSplit1').classList=document.querySelector('#pCard1').classList;
    document.querySelector('#pCardSplit2').classList=document.querySelector('#pCard2').classList;
    document.querySelector('#pCardSplit3').classList=document.querySelector('#pCard3').classList;
    document.querySelector('#pCardSplit4').classList=document.querySelector('#pCard4').classList;

    for (let i=1; i<(playerCards.length+1); i++){
        let j="#pCard" + i;
        let l="#pCardSplit"+i;
        $(l).fadeIn();
        $(j).fadeOut();
    }
    playerCards=playerCards2;
    $('#pCard1').fadeIn();
    $('#pCard2').fadeIn();
    document.querySelector('#pCard1').classList=onecardClass;
    document.querySelector('#pCard2').classList=twocardClass;
    split=false;
}

function computerTurn(){
    // checkSplit
    let keepGoing=true;
    let functionComplete=dealNewCard('c');
    //let i=0;
    if (functionComplete){
        while (keepGoing==true){
            if (computerSum<17 && computerSum<playerSum){
                //keepGoing = setTimeout(function(){ dealNewCard('c')},1000);
                keepGoing=dealNewCard('c');
            } else if (computerSum==playerSum && numOfRounds>1){
                keepGoing=false;
                aDraw();
            } else if ((computerSum>21) || (computerSum>=17 && computerSum<playerSum) || (computerSum==playerSum && numOfRounds==1 && computerCards.length==2)){
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
    // mainSection.classList.add('imgOverlay');
    playAudio('loosersound');
    if (playerSum>21){
        alertBanner.innerHTML="Busted, Dealer Wins."
    } else{
        alertBanner.innerHTML="Dealer Wins."
    }
    roundComplete();
}

function playerWins(){
    // mainSection.classList.add('imgOverlay');
    playAudio('winnersound');
    if (playerSum==21){
        totalMoney=totalMoney+4*betSum;
        alertBanner.innerHTML=`You Win $${betSum*3}`;
    } else{
        totalMoney=totalMoney+betSum*2
        alertBanner.innerHTML=`You Win $${betSum}`;
    }
    roundComplete();
}

function aDraw(){
    // mainSection.classList.add('imgOverlay');
    playAudio('loosersound');
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
    double=true;
    hitMe();
}

function addBet(y){
    if (y.length>1){
        y.shift();
    }
    if (totalMoney>sumOfArray(y)){
        // playAudio('chipsound');
        betValue=betValue.concat(y);
        let i=betValue.length;
        betChips1.src="img/chip"+betValue[i-3]+".png"
        betChips2.src="img/chip"+betValue[i-2]+".png"
        betChips3.src="img/chip"+betValue[i-1]+".png";
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
    } else if (betValue.length==2){
            betChips3.classList.add('hidden');
            betChips2.classList.add('hidden');
        betChips1.src="img/chip"+betValue[1]+".png";
        betChips1.classList.remove('hidden');
        alertBanner.innerHTML="Place your Bet and Click Deal";
    } else if (betValue.length==3){
            betChips3.classList.add('hidden');
        betChips2.src="img/chip"+betValue[2]+".png";
        betChips2.classList.remove('hidden');
        betChips1.src="img/chip"+betValue[1]+".png";
        betChips1.classList.remove('hidden');
    } else{
        betChips3.classList.remove('hidden');
        betChips2.classList.remove('hidden');
        betChips1.classList.remove('hidden');
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
    split=true;
    document.querySelector('#pCardSplit1').classList=document.querySelector('#pCard2').classList
    playerCards2[0]=playerCards[1];
    playerCards.pop();
    $('#pCard2').removeClass();
    $('#pCard2').fadeOut();
    $('#pCard2').addClass('card large');
    dealNewCard('p');
    stayButton.disabled=false;
    splitButton.disabled=true;
    $('#pCardSplit1').fadeIn();

    // document.querySelector('#pCard2').classList=document.querySelector('#pCard1').classList
    setTimeout(function(){dealNewCard('s')}, 1000);

    console.log("playerCard is " + playerCards);
    console.log("playerSum is " + playerSum);
    console.log("computerCard is " + computerCards);
    console.log("computerSum is " + computerSum);
}

//choose a random number
function getRandomNum (min,max){
    min= Math.ceil(min);
    max= Math.floor(max)
    return Math.floor(Math.random()*(max - min + 1))+min;
}

function convertNumToCard(cardVal){
    let newCard ='';
    // let convertAgain=false;
    let i= getRandomNum(1,4);
    let letter="d";
    if (i==1){letter="d";}
    else if (i==2){letter="h";}
    else if (i==3){letter="s";}
    else if (i==4){letter="c";}
    if (cardVal=='2'){ newCard= letter+'02';}
    else if (cardVal=='3'){ newCard= letter+'03';}
    else if (cardVal=='4'){ newCard= letter+'04';}
    else if (cardVal=='5'){ newCard= letter+'05';}
    else if (cardVal=='6'){ newCard= letter+'06';}
    else if (cardVal=='7'){ newCard= letter+'07';}
    else if (cardVal=='8'){ newCard= letter+'08';}
    else if (cardVal=='9'){ newCard= letter+'09';}
    else if (cardVal=='10'){ 
        let j= getRandomNum(1,4)+9;
        if (j==10){newCard= letter+'10';}
        else if (j==11){newCard= letter+'J';}
        else if (j==12){newCard= letter+'Q';}
        else if (j==13){newCard= letter+'K';}
    }
    else if (cardVal=='11'){ newCard= letter+'A';}
    else if (cardVal=='0'){ newCard= 'back';}
    else{ alert(`Card Value is out of range`);}

    //if class list already exist, then try a different random number
    // if (playerCards.length>0){
    //     for (let i=1; i<playerCards.length || i<computerCards.length; i++){
    //         console.log("i am here");
    //         console.log("$(j).hasClass(newCard)",$(j).hasClass(newCard));
    //         console.log("$(k).hasClass(newCard)", $(k).hasClass(newCard));
    //         let j="#pCard" + i;
    //         let k="#cCard"+i;
    //         if ($(j).hasClass(newCard) || $(k).hasClass(newCard)){
    //             convertAgain=true;
    //             convertNumToCard(cardVal);
    //         }
    //     }
        
    // }

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

