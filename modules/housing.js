class GenericHousing {
    constructor(generalInformation, monthlyInsurance, monthlyHOA){
        this.generalInformation = generalInformation;
        this.monthlyInsurance = monthlyInsurance;
        this.monthlyHOA = monthlyHOA;

        this.housingData = [];
    }

    calculateData() {
        throw new Error("Method 'calculateData()' must be implemented.");
    }
}

class HousingYear {
    constructor(age, value, yearlyCosts, totalCosts) {
        this.age = age;
        this.value = value;
        this.yearlyCosts = yearlyCosts;
        this.totalCosts = totalCosts;
    }
}

class House extends GenericHousing {
    constructor(generalInformation, monthlyInsurance, monthlyHOA,
                mortgage, downPayment, mortgageRate, mortgageTermYears,
                propertyTaxAssessment, homeAppreciationRate, oneTimeImprovements, annualMaintenanceCost) {
        super(generalInformation, monthlyInsurance, monthlyHOA);
        
        this.mortgage = mortgage;
        this.downPayment = downPayment;
        this.mortgageRate = mortgageRate;
        this.mortgageTermYears = mortgageTermYears;

        this.propertyTaxAssessment = propertyTaxAssessment;
        this.homeAppreciationRate = homeAppreciationRate;
        this.oneTimeImprovements = oneTimeImprovements;
        this.annualMaintenanceCost = annualMaintenanceCost;
    }

    calculateData() {
        var years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        var currentValue = this.downPayment;
        var monthlyMortgagePayment = this.mortgage * (this.mortgageRate / 12) / (1 - Math.pow(1 + this.mortgageRate / 12, -this.mortgageTermYears * 12));
        var yearlyMortgagePayment = monthlyMortgagePayment * 12;
        var yearlyInterest = (monthlyMortgagePayment * this.mortgageTermYears * 12 - this.mortgage) / this.mortgageTermYears;
        var yearlyPrincipal = yearlyMortgagePayment - yearlyInterest;
        var yearlyCosts = 0;

        for (var i = 0; i < years; i++) {
            if (i < this.mortgageTermYears) {
                currentValue = (currentValue + yearlyPrincipal) * (1 + this.homeAppreciationRate);
                yearlyCosts = yearlyMortgagePayment + this.annualMaintenanceCost + this.monthlyInsurance * 12 + 
                                this.monthlyHOA * 12 + this.propertyTaxAssessment + this.generalInformation.monthlySpending * 12;
            } else {
                currentValue = currentValue * (1 + this.homeAppreciationRate);
                yearlyCosts = this.annualMaintenanceCost + this.monthlyInsurance * 12 +
                                this.monthlyHOA * 12 + this.propertyTaxAssessment + this.generalInformation.monthlySpending * 12;
            }

            if (i === 0) {
                yearlyCosts += this.oneTimeImprovements;
            }

            this.housingData.push(new HousingYear(this.generalInformation.startAge + i, currentValue,
                                                    yearlyCosts, (i === 0 ? yearlyCosts : this.housingData[i - 1].totalCosts + yearlyCosts)));
            
            this.annualMaintenanceCost *= (1 + this.generalInformation.inflation);
            this.propertyTaxAssessment *= (1 + this.generalInformation.inflation);
            this.monthlyInsurance *= (1 + this.generalInformation.inflation);
            this.monthlyHOA *= (1 + this.generalInformation.inflation);
            this.generalInformation.monthlySpending *= (1 + this.generalInformation.inflation);
        }
    }
}

class Apartment extends GenericHousing {
    constructor(generalInformation, monthlyInsurance, monthlyHOA,
                monthlyRent, annualRentIncrease) {
        super(generalInformation, monthlyInsurance, monthlyHOA);

        this.monthlyRent = monthlyRent;
        this.annualRentIncrease = annualRentIncrease;
    }

    calculateData() {
        var years = this.generalInformation.lifeExpectancy - this.generalInformation.startAge;
        var currentRent = this.monthlyRent;
        var yearlyCosts = 0;

        for (var i = 0; i < years; i++) {
            yearlyCosts = currentRent * 12 + this.monthlyInsurance * 12 + this.monthlyHOA * 12 +
                            this.generalInformation.monthlySpending * 12;
            this.housingData.push(new HousingYear(this.generalInformation.startAge + i, 0,
                                                    yearlyCosts, (i === 0 ? yearlyCosts : this.housingData[i - 1].totalCosts + yearlyCosts)));
            currentRent = currentRent * (1 + this.annualRentIncrease);
            this.monthlyInsurance *= (1 + this.generalInformation.inflation);
            this.monthlyHOA *= (1 + this.generalInformation.inflation);
            this.generalInformation.monthlySpending *= (1 + this.generalInformation.inflation);
        }
    }
}