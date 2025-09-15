class LivingExpenses {
    constructor(generalInformation) {
        this.generalInformation = generalInformation;
        this.expensesData = [];
    }

    calculateData() {
        var years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        var yearlySpending = this.generalInformation.monthlySpending * 12;
        var yearlyRetirementSpending = this.generalInformation.retirementMonthlySpending * 12;

        var totalCosts = 0;

        for (var i = 0; i < years; i++) {
            yearlySpending = (i < (this.generalInformation.retirementAge - this.generalInformation.startAge) ? yearlySpending : yearlyRetirementSpending);
            totalCosts += yearlySpending;
            this.expensesData.push(new ExpensesYear(this.generalInformation.startAge + i, yearlySpending, totalCosts));
            
            yearlySpending *= (1 + this.generalInformation.inflation);
            yearlyRetirementSpending *= (1 + this.generalInformation.inflation);
        }
    }

}

class ExpensesYear {
    constructor(age, yearlySpending, totalCosts) {
        this.age = age;
        this.yearlySpending = yearlySpending;
        this.totalCosts = totalCosts;
    }
}
