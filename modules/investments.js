class GenericInvestment {
    constructor(generalInformation, amount, annualRate, monthlyContribution) {
        this.generalInformation = generalInformation;
        
        this.amount = amount;
        this.annualRate = annualRate;
        this.monthlyContribution = monthlyContribution;

        this.investmentData = [];
    }

    calculateData(costs) {
        throw new Error("Method 'calculateData()' must be implemented.");
    }
}

class InvestmentYear {
    constructor(age, value) {
        this.age = age;
        this.value = value;
    }
}

// Examples: Normal investing account and traditionl IRA
class TaxableInvestment extends GenericInvestment {
    constructor(generalInformation, amount, annualRate, monthlyContribution, taxRate) {
        super(generalInformation, amount, annualRate, monthlyContribution);
        this.taxRate = taxRate;
    }

    calculateData(costs) {
        var years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        var currentValue = this.amount;

        for (var i = 0; i < years; i++) {
            var values = []
            for (var j = 0; j < costs.length; j++){
                if (i < (this.generalInformation.retirementAge - this.generalInformation.startAge)) {
                    currentValue = ((i == 0 ? this.amount : this.investmentData[i - 1].value[j]) + this.monthlyContribution * 12) * (1 + this.annualRate);
                    values.push(currentValue);
                    continue;
                }

                var uncoveredLivingCosts = costs[j].housingData[i].yearlyCosts + 
                                            this.generalInformation.monthlyRetirementSpending * 12 -
                                            this.generalInformation.socialSecurity - 
                                            this.generalInformation.otherRetirementIncome;
                var contributions = this.monthlyContribution * 12 - (uncoveredLivingCosts < 0 ? uncoveredLivingCosts : 0);
                currentValue = ((i == 0 ? this.amount : this.investmentData[i - 1].value[j]) + contributions) * (1 + this.annualRate);
                values.push(currentValue);
            }
            this.investmentData.push(new InvestmentYear(this.generalInformation.startAge + i, values));
        }
    }
}

// Example: Roth IRA
class NonTaxableInvestment extends GenericInvestment {
    constructor(generalInformation, amount, annualRate, monthlyContribution) {
        super(generalInformation, amount, annualRate, monthlyContribution);
    }

    calculateData(costs) {
        var years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        var currentValue = this.amount;

        for (var i = 0; i < years; i++) {
            var values = []
            for (var j = 0; j < costs.length; j++){
                if (i < (this.generalInformation.retirementAge - this.generalInformation.startAge)) {
                    currentValue = ((i == 0 ? this.amount : this.investmentData[i - 1].value[j]) + this.monthlyContribution * 12) * (1 + this.annualRate);
                    values.push(currentValue);
                    continue;
                }

                var uncoveredLivingCosts = costs[j].housingData[i].yearlyCosts + 
                                            this.generalInformation.monthlyRetirementSpending * 12 -
                                            this.generalInformation.socialSecurity - 
                                            this.generalInformation.otherRetirementIncome;
                var contributions = this.monthlyContribution * 12 - (uncoveredLivingCosts < 0 ? uncoveredLivingCosts : 0);
                currentValue = ((i == 0 ? this.amount : this.investmentData[i - 1].value[j]) + contributions) * (1 + this.annualRate);
                values.push(currentValue);
            }
            this.investmentData.push(new InvestmentYear(this.generalInformation.startAge + i, values));
        }
    }
}