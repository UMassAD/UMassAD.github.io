
var WBPro = 19700.0;
var SSOPro = 30323.0;
var opDays = 365;
var totalCC = 18448000.0;

var naturalGasEVal = 0.6;
var EPrice = 0.15;
var creditVal = 33.00;
var OMCosts = 1855000.0;
var tax = 230000

var tipFee1 = 42.0;
var tipFee2 = 60.0;
var tipTransition = 10;

var salvagePercent = 0.11;
var depreciationYrs = 12;

var numWorkers = 5;
var workCost = 60000.0;
var workingCapital = 3000000.0;
var discountRate = 0.0585;

var yearTable = Array(17).fill(0);
var PVTable = Array(17).fill(0);

var sensArray = [[1,-1],[1,-1],[1,-1],[1,-1],[1,-1],[1,-1],[1,-1],[1,-1],[1,-1]];

// Calculator Value Update Function
function updateVal() {
	WBPro = parseFloat(document.getElementById("WBProcessing").value);
	SSOPro = parseFloat(document.getElementById("SSOProcessing").value);
	opDays = parseFloat(document.getElementById("opDays").value);
	// WBTonPerYr = parseFloat(document.getElementById("WBTonPerYr").value);
	// SSOTonPerYr = parseFloat(document.getElementById("SSOTonPerYr").value);
	totalCC = parseFloat(document.getElementById("totalCC").value);

	naturalGasEVal = parseFloat(document.getElementById("naturalGasEVal").value);
	EPrice = parseFloat(document.getElementById("EPrice").value);
	creditVal = parseFloat(document.getElementById("creditVal").value);
	OMCosts = parseFloat(document.getElementById("OMCosts").value);
	tax = parseFloat(document.getElementById("tax").value);

	tipFee1 = parseFloat(document.getElementById("tipFee1").value);
	tipFee2 = parseFloat(document.getElementById("tipFee2").value);
	tipTransition = parseFloat(document.getElementById("tipTransition").value);

	salvagePercent = parseFloat(document.getElementById("salvagePercent").value);
	depreciationYrs = parseFloat(document.getElementById("depreciationYrs").value);

	numWorkers = parseFloat(document.getElementById("numWorkers").value);
	workCost = parseFloat(document.getElementById("workCost").value);
	workingCapital = parseFloat(document.getElementById("workingCapital").value);
	discountRate = parseFloat(document.getElementById("discountRate").value);
}

// Calculator Main Function
function calc() {
	// Update values from form
	updateVal();
	// (0) Calculate Biogas output
	var bioOut = 15*0.5*0.44333*WBPro + 13.6*0.697*1.084*SSOPro;
	document.getElementById("bioOut").innerHTML = "Total Biogas Ouput (cf/day): " + bioOut;
	// (5) Total Biogas (cf/yr) assuming linear relation
	var totalBioPerYr = bioOut*opDays;
	var MePerYr = 0.66*totalBioPerYr/35.3147; // m^3 methane per yr
	document.getElementById("totalBioPerYr").innerHTML = "Total Biogas (cf/yr): " + totalBioPerYr.toFixed(2);
	document.getElementById("MePerYr").innerHTML = "Methane (m^3/yr): " + MePerYr.toFixed(2);
	// (6) Energy Value Computation
	var kWhPerYr = 0.6*naturalGasEVal*MePerYr/3.6;
	document.getElementById("kWhPerYr").innerHTML = "Total Energy per year (kWh/yr): " + kWhPerYr.toFixed(2);
	// (7) Total Electricity Savings ($/yr)
	var ESavings = EPrice*kWhPerYr;
	document.getElementById("ESavings").innerHTML = "Electricity Savings from Energy ($/yr): " + ESavings.toFixed(2);
	// (8) Renewable Energy Credits and Tax Breaks
	var creditValPerYr = kWhPerYr/1000*creditVal;
	document.getElementById("creditValPerYr").innerHTML = "Annual Renewables Credit Value ($/yr): " + creditValPerYr.toFixed(2);
	// (9) Adjusting for Num Biodigesters
	// (10) O&M Costs
	// (11) Town Taxes
	// (12) SSO Tipping Revenues
	var SSOTonPerYr = (1.084*SSOPro/2000*opDays/0.3);
	var WBTonPerYr = (0.5*WBPro/2000*opDays/0.06);
	document.getElementById("SSOTonPerYr").innerHTML = "SSO Ton Per Yr: " + SSOTonPerYr.toFixed(2);
	document.getElementById("WBTonPerYr").innerHTML = "WB Ton Per Yr: " + WBTonPerYr.toFixed(2);
	var SSOTipRev1 = tipFee1 * (1.084*SSOPro/2000*opDays/0.3);
	var SSOTipRev2 = tipFee2 * (1.084*SSOPro/2000*opDays/0.3); // 75% To account for less demand
	document.getElementById("SSOTipRev1").innerHTML = "Annual Revenue from SSO Tips in Period 1 ($/yr): " + SSOTipRev1.toFixed(2);
	document.getElementById("SSOTipRev2").innerHTML = "Annual Revenue from SSO Tips in Period 2 ($/yr): " + SSOTipRev2.toFixed(2);
	// (13) Depreciation
	var depreciationVal = totalCC * (1-salvagePercent) / depreciationYrs;
	document.getElementById("depreciationVal").innerHTML = "Depreciation Value ($/yr): " + depreciationVal.toFixed(2);

	// Results Table ("book")
	var bookBody = document.getElementById("book-body");

	var laborTable = Array(17);
	var OMTable = Array(17);
	var taxTable = Array(17);
	var SSOTipRevTable = Array(17);
	var ESavingsTable = Array(17);
	var ECreditsTable = Array(17);
	var SLDTable = Array(17);
	var salvageTable = Array(17);
	var capitalTable = Array(17);
	var sumTable = Array(17);
	
	yearTable[0] = 0;
	laborTable[0] = 0;
	OMTable[0] = 0;
	taxTable[0] = 0;
	SSOTipRevTable[0] = 0;
	ESavingsTable[0] = 0;
	ECreditsTable[0] = 0;
	SLDTable[0] = 0;
	salvageTable[0] = 0;
	capitalTable[0] = -totalCC;

	for (var i = 1; i < yearTable.length; i++) {
		yearTable[i] = i;
		laborTable[i] = -(numWorkers*workCost)*Math.pow(1.03,i-1);
		OMTable[i] = -OMCosts;
		taxTable[i] = -tax;
		if (i < tipTransition) {
			SSOTipRevTable[i] = SSOTipRev1;
		} else {
			SSOTipRevTable[i] = SSOTipRev2;
		}
		ESavingsTable[i] = ESavings;
		ECreditsTable[i] = creditValPerYr;
		if (i <= depreciationYrs) {
			SLDTable[i] = depreciationVal;
		} else {
			SLDTable[i] = 0;
		}
		if (i === yearTable.length-1) {
			salvageTable[i] = salvagePercent*totalCC;
			capitalTable[i] = workingCapital;
		} else {
			salvageTable[i] = 0;
			capitalTable[i] = 0;
		}
	}

	for (var i = 0; i < yearTable.length; i++) {
		// Sums and NPV
		sumTable[i] = laborTable[i] + OMTable[i] + taxTable[i] + SSOTipRevTable[i] + ESavingsTable[i] + ECreditsTable[i] + SLDTable[i] + salvageTable[i] + capitalTable[i];
		PVTable[i] = sumTable[i]/Math.pow((1+discountRate),yearTable[i]);

		// Year column
		bookBody.rows[i].cells[0].innerHTML = yearTable[i];
		if (i === 0) {
			bookBody.rows[i].cells[1].innerHTML = '$'+laborTable[i].toFixed(2);
			bookBody.rows[i].cells[2].innerHTML = '$'+OMTable[i].toFixed(2);
			bookBody.rows[i].cells[3].innerHTML = '$'+taxTable[i].toFixed(2);
			bookBody.rows[i].cells[4].innerHTML = '$'+SSOTipRevTable[i].toFixed(2);
			bookBody.rows[i].cells[5].innerHTML = '$'+ESavingsTable[i].toFixed(2);
			bookBody.rows[i].cells[6].innerHTML = '$'+ECreditsTable[i].toFixed(2);
			bookBody.rows[i].cells[7].innerHTML = '$'+SLDTable[i].toFixed(2);
			bookBody.rows[i].cells[8].innerHTML = '$'+salvageTable[i].toFixed(2);
			bookBody.rows[i].cells[9].innerHTML = '-$'+Math.abs(capitalTable[i]).toFixed(2);
			bookBody.rows[i].cells[10].innerHTML = '-$'+Math.abs(sumTable[i]).toFixed(2);
			bookBody.rows[i].cells[11].innerHTML = '-$'+Math.abs(PVTable[i]).toFixed(2);
		} else {
			// Labor column
			bookBody.rows[i].cells[1].innerHTML = laborTable[i].toFixed(2);
			// O&M Column
			bookBody.rows[i].cells[2].innerHTML = OMTable[i].toFixed(2);
			// Tax Column
			bookBody.rows[i].cells[3].innerHTML = taxTable[i].toFixed(2);
			// SSO tip Revenue Column
			bookBody.rows[i].cells[4].innerHTML = SSOTipRevTable[i].toFixed(2);
			// Electricity Savings Column
			bookBody.rows[i].cells[5].innerHTML = ESavingsTable[i].toFixed(2);
			// Energy Credits Column
			bookBody.rows[i].cells[6].innerHTML = ECreditsTable[i].toFixed(2);
			// SLD Column
			bookBody.rows[i].cells[7].innerHTML = SLDTable[i].toFixed(2);
			// Salvage Column
			bookBody.rows[i].cells[8].innerHTML = salvageTable[i].toFixed(2);
			// Capital Column
			bookBody.rows[i].cells[9].innerHTML = capitalTable[i].toFixed(2);
			// PV
			bookBody.rows[i].cells[10].innerHTML = sumTable[i].toFixed(2);
			// NPV
			bookBody.rows[i].cells[11].innerHTML = PVTable[i].toFixed(2);
		}

	}

	var NPV = PVTable.reduce((a, b) => a + b, 0);
	document.getElementById("NPV").innerHTML = "<b><u>Net Present Value ($):</u></b> " + NPV.toFixed(2);

	// Sensitivity Analysis
	var sensBody = document.getElementById("sensitivity-body");
	// Vary WBPro
	sensArray[0][0] = NPVOnly(1.1*WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensArray[0][1] = NPVOnly(0.9*WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[1].innerHTML = sensArray[0][0].toFixed(2);
	sensBody.rows[1].cells[1].innerHTML = sensArray[0][1].toFixed(2);
	// Vary SSOPro
	sensArray[1][0] = NPVOnly(WBPro,1.1*SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensArray[1][1] = NPVOnly(WBPro,0.9*SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[2].innerHTML = sensArray[1][0].toFixed(2);
	sensBody.rows[1].cells[2].innerHTML = sensArray[1][1].toFixed(2);
	// Vary naturalGasEVal
	sensArray[2][0] = NPVOnly(WBPro,SSOPro,1.1*naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensArray[2][1] = NPVOnly(WBPro,SSOPro,0.9*naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[3].innerHTML = sensArray[2][0].toFixed(2);
	sensBody.rows[1].cells[3].innerHTML = sensArray[2][1].toFixed(2);
	// Vary EPrice
	sensArray[3][0] = NPVOnly(WBPro,SSOPro,naturalGasEVal,1.1*EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensArray[3][1] = NPVOnly(WBPro,SSOPro,naturalGasEVal,0.9*EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[4].innerHTML = sensArray[3][0].toFixed(2);
	sensBody.rows[1].cells[4].innerHTML = sensArray[3][1].toFixed(2);
	// Vary creditVal
	sensArray[4][0] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,1.1*creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensArray[4][1] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,0.9*creditVal,tipFee1,tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[5].innerHTML = sensArray[4][0].toFixed(2);
	sensBody.rows[1].cells[5].innerHTML = sensArray[4][1].toFixed(2);
	// Vary tip fees
	sensArray[5][0] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,1.1*tipFee1,1.1*tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensArray[5][1] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,0.9*tipFee1,0.9*tipFee2,workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[6].innerHTML = sensArray[5][0].toFixed(2);
	sensBody.rows[1].cells[6].innerHTML = sensArray[5][1].toFixed(2);
	// Vary OM Costs
	sensArray[6][0] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,1.1*OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensArray[6][1] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,0.9*OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[7].innerHTML = sensArray[6][0].toFixed(2);
	sensBody.rows[1].cells[7].innerHTML = sensArray[6][1].toFixed(2);
	// Vary Taxes
	sensArray[7][0] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,1.1*tax).toFixed(2) - NPV.toFixed(2);
	sensArray[7][1] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,workCost,OMCosts,0.9*tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[8].innerHTML = sensArray[7][0].toFixed(2);
	sensBody.rows[1].cells[8].innerHTML = sensArray[7][1].toFixed(2);
	// Vary Work Costs
	sensArray[8][0] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,1.1*workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensArray[8][1] = NPVOnly(WBPro,SSOPro,naturalGasEVal,EPrice,creditVal,tipFee1,tipFee2,0.9*workCost,OMCosts,tax).toFixed(2) - NPV.toFixed(2);
	sensBody.rows[0].cells[9].innerHTML = sensArray[8][0].toFixed(2);
	sensBody.rows[1].cells[9].innerHTML = sensArray[8][1].toFixed(2);

	// Charts
	PVChart.data.datasets.data = PVTable;
	PVChart.update();
	sensChart.data.datasets[0].data = [sensArray[0][0],sensArray[1][0],sensArray[2][0],sensArray[3][0],sensArray[4][0],sensArray[5][0],sensArray[6][0],sensArray[7][0],sensArray[8][0]];
	sensChart.data.datasets[1].data = [sensArray[0][1],sensArray[1][1],sensArray[2][1],sensArray[3][1],sensArray[4][1],sensArray[5][1],sensArray[6][1],sensArray[7][1],sensArray[8][1]];
	sensChart.update();
}

function NPVOnly(WBP,SSOP,EVal,EPr,crVal,fee1,fee2,wCost,OM,tx) {
	var bioOut = 15*0.5*0.44333*WBP + 13.6*0.697*1.084*SSOP;
	// (5) Total Biogas (cf/yr) assuming linear relation
	var totalBioPerYr = bioOut*opDays;
	var MePerYr = 0.66*totalBioPerYr/35.3147; // m^3 methane per yr
	// (6) Energy Value Computation
	var kWhPerYr = 0.6*EVal*MePerYr/3.6;
	// (7) Total Electricity Savings ($/yr)
	var ESavings = EPr*kWhPerYr;
	// (8) Renewable Energy Credits and Tax Breaks
	var creditValPerYr = kWhPerYr/1000*crVal;
	// (12) SSO Tipping Revenues
	var SSOTipRev1 = fee1 * (1.084*SSOP/2000*opDays/0.3);
	var SSOTipRev2 = fee2 * (1.084*SSOP/2000*opDays/0.3); // 75% To account for less demand
	// (13) Depreciation
	var depreciationVal = totalCC * (1-salvagePercent) / depreciationYrs;

	// Results Table ("book")
	
	var laborTable = Array(17);
	var OMTable = Array(17);
	var taxTable = Array(17);
	var SSOTipRevTable = Array(17);
	var ESavingsTable = Array(17);
	var ECreditsTable = Array(17);
	var SLDTable = Array(17);
	var salvageTable = Array(17);
	var capitalTable = Array(17);
	var sumTable = Array(17);
	var PVTable = Array(17);
	
	yearTable[0] = 0;
	laborTable[0] = 0;
	OMTable[0] = 0;
	taxTable[0] = 0;
	SSOTipRevTable[0] = 0;
	ESavingsTable[0] = 0;
	ECreditsTable[0] = 0;
	SLDTable[0] = 0;
	salvageTable[0] = 0;
	capitalTable[0] = -totalCC;

	for (var i = 1; i < yearTable.length; i++) {
		yearTable[i] = i;
		laborTable[i] = -(numWorkers*wCost)*Math.pow(1.03,i-1);
		OMTable[i] = -OM;
		taxTable[i] = -tx;
		if (i < tipTransition) {
			SSOTipRevTable[i] = SSOTipRev1;
		} else {
			SSOTipRevTable[i] = SSOTipRev2;
		}
		ESavingsTable[i] = ESavings;
		ECreditsTable[i] = creditValPerYr;
		if (i <= depreciationYrs) {
			SLDTable[i] = depreciationVal;
		} else {
			SLDTable[i] = 0;
		}
		if (i === yearTable.length-1) {
			salvageTable[i] = salvagePercent*totalCC;
			capitalTable[i] = workingCapital;
		} else {
			salvageTable[i] = 0;
			capitalTable[i] = 0;
		}
	}

	for (var i = 0; i < yearTable.length; i++) {
		// Sums and NPV
		sumTable[i] = laborTable[i] + OMTable[i] + taxTable[i] + SSOTipRevTable[i] + ESavingsTable[i] + ECreditsTable[i] + SLDTable[i] + salvageTable[i] + capitalTable[i];
		PVTable[i] = sumTable[i]/Math.pow((1+discountRate),yearTable[i]);
	}

	return PVTable.reduce((a, b) => a + b, 0);
}

// Navigation
function nav(location) {
    document.getElementById("home").style.display = location == 1 ? 'block' : 'none';
	document.getElementById("past-work").style.display = location == 2 ? 'block' : 'none';
	document.getElementById("about-us").style.display = location == 3 ? 'block' : 'none';
	document.getElementById("calculator").style.display = location == 4 ? 'block' : 'none';
}

// Charts
var PVctx = document.getElementById('PV-chart');
var PVChart = new Chart(PVctx, {
	type: 'bar',
	data: {
		labels: yearTable,
		datasets: [{
			label: 'Cash Flow',
			data: PVTable,
			backgroundColor: 'rgba(27, 171, 44, 0.3)',
			borderColor: 'rgba(27, 171, 44, 0.7)',
			borderWidth: 1
		}]
	},
	options: {
		title: {
			display: true,
			text: 'Discounted Cash Flow Diagram',
			fontSize: 20,
			fontColor: '#353535'
		},
		scales: {
			yAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Cash Flow ($)',
					fontSize: 16,
					fontColor: '#353535'
				}
			}],
			xAxes: [{
				scaleLabel: {
					display: true,
					labelString: 'Years of Operation',
					fontSize: 16,
					fontColor: '#353535'
				}
			}]
		},
		tooltips: {
			enabled: false
		},
		legend: {
			display: false
		},
		aspectRatio: 3
	}
});

var sensctx = document.getElementById('sensitivity-chart');
var sensChart = new Chart(sensctx, {
	type: 'horizontalBar',
	data: {
		labels: ['WB Processing','SSO Processing','Natural Gas Energy Value','Electricity Price','Renewable Energy Credit Value','SSO Tipping Fees','O&M Costs','Town Taxes','Cost Per Worker'],
		datasets: [{
			label: '+10%',
			data: [sensArray[0][0],sensArray[1][0],sensArray[2][0],sensArray[3][0],sensArray[4][0],sensArray[5][0],sensArray[6][0],sensArray[7][0],sensArray[8][0]],
			backgroundColor: 'rgba(27, 171, 44, 0.3)',
			borderColor: 'rgba(27, 171, 44, 0.7)',
			borderWidth: 1
		},
		{
			label: '-10%',
			data: [sensArray[0][1],sensArray[1][1],sensArray[2][1],sensArray[3][1],sensArray[4][1],sensArray[5][1],sensArray[6][1],sensArray[7][1],sensArray[8][1]],
			backgroundColor: 'rgba(179, 27, 27, 0.3)',
			borderColor: 'rgba(179, 27, 27, 0.7)',
			borderWidth: 1	
		}]
	},
	options: {
		title: {
			display: true,
			text: 'Sensitivity Diagram',
			fontSize: 20,
			fontColor: '#353535'
		},
		tooltips: {
			enabled: false
		},
		scales: {
            xAxes: [{
				stacked: true,
				scaleLabel: {
					display: true,
					labelString: 'Change in NPV',
					fontSize: 16,
					fontColor: '#353535'
				}
            }],
            yAxes: [{
                stacked: true
            }]
		},
		aspectRatio: 3
	}
});
