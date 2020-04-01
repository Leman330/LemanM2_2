class Deposit {
  constructor(deposit, monthIcrease, period, currency, canDeposit) {
    this.deposit = deposit;
    this.monthIcrease = monthIcrease;
    this.period = period;
    this.currency = currency;
    this.canDeposit = monthIcrease > 0;
  }
}

class BankProduct {
  constructor() {
    this.res = banks;
  }

  // функция находит все подходящие варианты
  findOffers(client) {
    let tbMainDiv = document.querySelector('.tbMain');
    const fitOffer = this.res.filter(b => {
      if (client.canDeposit) {
        if (client.deposit >= b.sumMin && client.deposit <= b.sumMax && client.canDeposit == b.canDeposit && client.period >= b.termMin && client.period <= b.termMax && client.currency == b.currency) {
          return b;
        }
      } else {
        if (client.deposit > b.sumMin && client.deposit < b.sumMax && client.period >= b.termMin && client.period <= b.termMax && client.currency == b.currency) {
          return b;
        }
      }
    });
    if (fitOffer.length == 0) {
      tbMainDiv.innerHTML = "Нет подходящих вариантов";
      return false;
    }
    return fitOffer;
  }
}

// класс выбирает самый выгодный вариант
class Calculator {
  constructor() { }

  calcFitted(startDoc, monthIncreaseDoc, periodDoc, bestOffers) {
    let total = startDoc;
    let maxOffer = this.getMaxIncomeBank(bestOffers);
    for (let b of maxOffer) {
      total = startDoc;
      for (let i = 0; i < periodDoc; i++) {
        total += (total * b.incomeType) / 12 / 100;
        if (i != periodDoc - 1) {
          total += monthIncreaseDoc;
        }
      }
      b.total = Math.round(total);
    }
    return total;
  }


  getMaxIncomeBank(bestOffers) {
    let maxIncome = bestOffers.reduce((prev, cur) => {
      if (prev.incomeType > cur.incomeType) {
        return prev;
      }
      return cur;
    });
    let maxIncomeBank = bestOffers.filter(b => b.incomeType == maxIncome.incomeType);
    return maxIncomeBank;
  }
}

//класс поквзывает самый выгодное предложение 
class Application {
  constructor() { 
    this.offer = []; 
    this.startDoc = document.getElementById("start"); 
    this.monthIncreaseDoc = document.getElementById("monthIncrease"); 
    this.periodDoc = document.getElementById("period"); 
    this.currency = document.querySelector("#currency"); 
    this.btn = document.getElementById("btn"); 
    this.btn.addEventListener("click", this.showOffers);
  }

  showOffers = () => { 
    if (this.checkInput(+this.startDoc.value, +this.monthIncreaseDoc.value, +this.periodDoc.value)) { 
      let e = currency.options[currency.selectedIndex].value; 
      let client = new Deposit(+this.startDoc.value, +this.monthIncreaseDoc.value, +this.periodDoc.value, e);
      let bank = new BankProduct();
      let calc = new Calculator();
      let bestOffers = bank.findOffers(client);
      if (bestOffers) {
        calc.calcFitted(+this.startDoc.value, +this.monthIncreaseDoc.value, +this.periodDoc.value, bestOffers);
        this.offer = Array.from(calc.getMaxIncomeBank(bestOffers)); 
        this.createTable();
      }
    }
    return false;
  }

  createTable() { // создпние таблицы
    let tbMain = document.querySelector(".tbMain");
    let arr = [];
    arr[0] = '<table class="offer"><tr><th>Название банка</th><th>Вклад</th><th>Процент</th><th>Итоговая сумма</th></tr>';
    for (let i = 0; i < this.offer.length; i++) {
      let bankName = this.offer[i].bankName;
      let investName = this.offer[i].investName;
      let incomeType = this.offer[i].incomeType;
      let total = this.offer[i].total;
      arr[i + 1] = this.createRow(bankName, investName, incomeType, total);
    }
    tbMain.innerHTML = "<table>" + arr.join("") + "</table>";
  }

  // создаем строки таблицы
  createRow(bankName, investName, incomeType, total) {
    const name = "<td>" + bankName + "</td>";
    const invest = "<td>" + investName + "</td>";
    const income = "<td>" + incomeType + "</td>";
    const price = "<td>" + total + "</td>";

    let row = "<tr>" + name + invest + income + price + "</tr>";
    return row;
  }

  checkInput(startDoc, monthIncreaseDoc, periodDoc) {
    let tbMainDiv = document.querySelector('.tbMain');
    if (startDoc == "" && monthIncreaseDoc == "" && periodDoc == "") {
      tbMainDiv.innerHTML = "";
      alert("Заполните пожалуйста поля!");
      return false;
    }
    if (startDoc <= 0) {
      tbMainDiv.innerHTML = "";
      alert("Начальная сумма должна быть больше нуля");
      return false;
    }
    if (monthIncreaseDoc < 0) {
      tbMainDiv.innerHTML = "";
      alert("Сумма ежемесячного пополнения должна быть больше или равна нулю");
      return false;
    }
    if (periodDoc <= 0) {
      tbMainDiv.innerHTML = "";
      alert("Срок вклада должнен быть больше нуля");
      return false;
    }
    return true;
  }
}

new Application();



