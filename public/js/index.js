const baseUrl = "https://noroff-komputer-store-api.herokuapp.com/";
const compUrl ="https://noroff-komputer-store-api.herokuapp.com/computers"; 

// top left
const balanceElement = document.getElementById("balance");
const getLoanElement = document.getElementById("getLoan");
const loanDueElement = document.getElementById("loanDue");
const outstandingLoanElement = document.getElementById("outstandingLoan");

// top centre
const payElement = document.getElementById("pay");
const bankElement = document.getElementById("bank");
const workElement = document.getElementById("work");
const repayLoanElement = document.getElementById("repayLoan");
const debtFromLoanElement = document.getElementById("debt");
const repayLoanButtonElement = document.getElementById("repayLoanButton");

// top right
const laptopsElement = document.getElementById("laptops");
const buyLaptopElement = document.getElementById("buyLaptop");
const laptopSpecsElement = document.getElementById("specs");

// bottom
const laptopTitleElement = document.getElementById("laptopTitle");
const laptopPriceBottomElement = document.getElementById("laptopPrice");
const laptopDescriptionElement = document.getElementById("laptopDescription");
const laptopImgElement = document.getElementById("laptopImg");



// user 
const user = {
    firstName: "John",
    lastName: "Dough", 
    accountBalance: 0.0, 
    hasLoan: false,
    hasAssets: false,
    loanSum: 0.0,
    workPay: 0.0
}

let laptops = [];

// start script onload
window.onload =  function startScript(){
    fetch(compUrl)
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops))
    .catch(error => console.log('error: ', error));
}


// add laptops to laptop menu
const addLaptopsToMenu = (laptops) => {
    laptops.forEach(x => addLaptopToMenu(x));
    laptopTitleElement.innerText = laptop[0].title;
    laptopSpecsElement.innerText = laptop[0].specs[3];
    laptopPriceBottomElement.innerText = laptop[0].price;
    laptopImgElement.src = baseUrl + laptop[0].image;

}

// for each individual laptop
const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title));
    laptopsElement.appendChild(laptopElement);
}




// choose a computer in select menu
const handleLaptopMenuChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    buyLaptopElement.style.display = "inline-block";
    laptopSpecsElement.innerText = selectedLaptop.specs[3] + "\n" + selectedLaptop.specs[0] + "\n" + selectedLaptop.specs[2];
    laptopTitleElement.innerText = selectedLaptop.title;
    laptopPriceBottomElement.innerText = selectedLaptop.price + "kr";
    laptopDescriptionElement.innerText = selectedLaptop.description;
    const laptopUrl = baseUrl + selectedLaptop.image;
    fetch(laptopUrl)
    .then(response => {
        if(response.ok){
            laptopImgElement.src = laptopUrl;
        }else{
            laptopImgElement.src = "public/assets/images/goat.png";
        }
    })
    .catch(error => console.log('error: ', error));
    
}



// buy a pc
const handleBuyPc = () => {
    const selectedLaptop = laptops[laptopsElement.selectedIndex];
    if(user.accountBalance < selectedLaptop.price){
        alert("I don’t think you have the facilities for that, Big Man...");
    }else{
        alert("Thank you for buying (x1) " + "´"+ selectedLaptop.title+ "´");
        user.accountBalance-= selectedLaptop.price;
        user.hasAssets = true;
        balanceElement.innerText = "Balance: " + (user.accountBalance) + "kr";
    }
}


// get a loan 
const handleLoan = () => {
    if(!user.hasAssets){
        alert("you need a pc");
    }else if(user.hasLoan){
        alert("you already in debt");
    }else if(user.accountBalance === 0){
        alert("time to get yo bands up");
    }else{
        let loanAmount = parseFloat (window.prompt("How much do you need to borrow?: ", user.accountBalance/2));
        if(loanAmount < 1){
            alert("value is too low");
        }else if(!Number.isInteger(loanAmount)){
            alert("this bank can only handle currency rounded to the nearest whole number");
        }else{
            if(loanAmount <= (user.accountBalance/2)){
                alert("thanks for borrowing " + loanAmount + "kr" + " from our bank");
                user.accountBalance+= loanAmount;
                balanceElement.innerText = "Balance: " + user.accountBalance + "kr";
                user.loanSum = loanAmount;
                debtFromLoanElement.innerText = "Debt: " + user.loanSum + "kr";
                user.hasLoan = true;
                repayLoanElement.style.display = "block";
                
            }else if(loanAmount > (user.accountBalance/2)){
                alert("insufficient funds mate");
            }else{
                alert("An error occured");
            }
        } 
    }

}


// pay off loan
const handlePayOffLoan = () => {
    if(!user.hasLoan){
        alert("an error occured");
    }else if (user.workPay>0){
        if(user.workPay>user.loanSum){
            const changeFromPayment = (-1)*(user.loanSum-user.workPay);
            user.accountBalance+= changeFromPayment;
            balanceElement.innerText = "Balance: " + user.accountBalance + "kr";
            user.loanSum = 0;
            user.hasLoan = false;
            repayLoanElement.style.display ="none";
            user.workPay = 0;
            payElement.innerText = "Pay: " + user.workPay + "kr";   
        }else{
            user.loanSum -= user.workPay;
            if(user.loanSum === 0){
                user.hasLoan = false;
                repayLoanElement.style.display = "none";
                user.accountBalance += (user.workPay-user.loanSum);
                balanceElement.innerText = "Balance: " + user.accountBalance + "kr";
                debtFromLoanElement.innerText = "Debt: " + user.loanSum + "kr";
                user.workPay = 0;
                payElement.innerText = "Pay: " + user.workPay + "kr";   
            }else{
                user.workPay = 0;
                payElement.innerText = "Pay: " + user.workPay + "kr";   
                debtFromLoanElement.innerText = "Debt: " + user.loanSum + "kr";
            }

        }

    }else{
        let payOffAmount = parseFloat (window.prompt("How much would you like to pay off?: ", 0));
        if(payOffAmount<1){
            alert("value is too low");
        }else if(!Number.isInteger(payOffAmount)){
            alert("this bank can only handle currency rounded to the nearest whole number");
        }else if(payOffAmount > user.accountBalance){
            alert("you haven't got " + payOffAmount + "kr in your account lol");
        }else{
            if(payOffAmount>user.loanSum){
                const changeFromPayment = (-1)*(user.loanSum-payOffAmount);
                user.accountBalance-= payOffAmount; 
                user.accountBalance+= changeFromPayment;
                user.loanSum = 0;
                user.hasLoan = false;
                repayLoanElement.style.display ="none";
                balanceElement.innerText = "Balance: " + user.accountBalance + "kr";
                alert("you have paid off your loan!" + "\n" + "your account balance: " + user.accountBalance + "kr" );
            }else{
                user.accountBalance-= payOffAmount;
                user.loanSum-= payOffAmount;
                if(user.loanSum === 0){
                    user.hasLoan = false;
                    balanceElement.innerText = "Balance: " + user.accountBalance;
                    repayLoanElement.style.display ="none";
                    alert("you have paid off your loan! " + "\n" + "your account balance: " + user.accountBalance + "kr" );
                }else{
                    debtFromLoanElement.innerText = "Debt: " + user.loanSum + "kr";
                    balanceElement.innerText = "Balance: " + user.accountBalance + "kr";
                    alert("left to pay on your loan: " + user.loanSum + "\n" + "your account balance: " + user.accountBalance + "kr" );
                }
            }         
        }
    }
}




// bank earned money
const handleBankMoney = () => {
    if(user.workPay === 0){
        alert("you aint worked yet");
    }else if(user.hasLoan){
        let percentOfPay = (user.workPay/10);
        if(user.loanSum < percentOfPay){
            percentOfPay-=user.loanSum;
            user.loanSum = 0;
            user.hasLoan = false;
            repayLoanElement.style.display = "none";

            user.accountBalance+=(user.workPay-percentOfPay);
            balanceElement.innerText= "Balance: "+user.accountBalance + "kr";
            user.workPay = 0;
            payElement.innerText = "Pay: " + user.workPay + "kr";
        
        }else if(user.loanSum === percentOfPay){
            user.loanSum = 0;
            user.hasLoan = false;
            repayLoanElement.style.display = "none";
            user.accountBalance+=(user.workPay-percentOfPay);
            user.workPay = 0;
            balanceElement.innerText = "Balance: " + user.accountBalance + "kr";
            payElement.innerText = "Pay: " + user.workPay + "kr";
            
        }else{
            user.loanSum -= percentOfPay;
            user.accountBalance+= (user.workPay-percentOfPay);
            balanceElement.innerText = "Balance: " + user.accountBalance + "kr";
            user.workPay = 0;
            payElement.innerText = "Pay: " + user.workPay + "kr";
            debtFromLoanElement.innerText = "Debt: " + user.loanSum + "kr";

        }
    }else{
        user.accountBalance+=(user.workPay);
        balanceElement.innerText = "Balance: " + user.accountBalance + "kr";
        user.workPay = 0;
        payElement.innerText = "Pay: " + user.workPay + "kr";
    }
}

// work

const handleWork = () => {
    user.workPay+=100;
    payElement.innerText = "Pay: " + user.workPay + "kr";
}




// event listeners

laptopsElement.addEventListener("change", handleLaptopMenuChange);
buyLaptopElement.addEventListener("click", handleBuyPc);
workElement.addEventListener("click", handleWork);
bankElement.addEventListener("click", handleBankMoney);
getLoanElement.addEventListener("click", handleLoan);
repayLoanButtonElement.addEventListener("click",handlePayOffLoan);
