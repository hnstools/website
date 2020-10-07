"use strict";
var Calculator = {
    display: document.querySelector("#display div"),
    significantDigits: 9,
    currentOperationEle: null,
    result: 0,
    currentInput: "",
    operationToBeApplied: "",
    inputDigits: 0,
    decimalMark: !1,
    updateDisplay: function () {
        var t = this.currentInput || this.result.toString(),
            e = new RegExp(1 / 0 + "", "g"),
            i = t.replace(e, "∞").replace(NaN, "Error");
        this.display.textContent = i;
        var s = this.display.parentNode.offsetWidth - 60,
            a = this.display.offsetWidth,
            r = Math.min(1, s / a);
        this.display.style.fontSize = 5.5 * r + "rem";
    },
    appendDigit: function (t) {
        if (!(this.inputDigits + 1 > this.significantDigits || ("0" === this.currentInput && "0" === t))) {
            if ("." === t) {
                if (this.decimalMark) return;
                (this.decimalMark = !0), this.currentInput || (this.currentInput += "0");
            } else "0" === this.currentInput && "0" !== t ? (this.currentInput = "") : ++this.inputDigits;
            this.operationToBeApplied || (this.result = 0), (this.currentInput += t), this.updateDisplay();
        }
    },
    appendOperator: function (t) {
        switch (((this.decimalMark = !1), this.operationToBeApplied && this.currentInput ? this.calculate() : this.result || ((this.result = parseFloat(this.currentInput)), (this.currentInput = "")), t)) {
            case "+":
                this.operationToBeApplied = "+";
                break;
            case "-":
                this.currentInput || this.result ? (this.operationToBeApplied = "-") : ((this.currentInput += "-"), this.updateDisplay());
                break;
            case "×":
                this.operationToBeApplied = "*";
                break;
            case "÷":
                this.operationToBeApplied = "/";
        }
        this.inputDigits = 0;
    },
    backSpace: function () {
        (this.currentInput = ""), (this.operationToBeApplied = ""), (this.result = 0), (this.inputDigits = 0), (this.decimalMark = !1), this.updateDisplay();
    },
    calculate: function () {
        var t = 0,
            e = parseFloat(this.result),
            i = parseFloat(this.currentInput);
        switch (this.operationToBeApplied) {
            case "+":
                t = e + i;
                break;
            case "-":
                t = e - i;
                break;
            case "*":
                t = e * i;
                break;
            case "/":
                t = 0 == i ? NaN : e / i;
        }
        (this.result = parseFloat(t.toPrecision(this.significantDigits))),
            (t > this.maxDisplayableValue || t < -this.maxDisplayableValue) && (this.result = this.result.toExponential()),
            (this.currentInput = ""),
            (this.operationToBeApplied = ""),
            (this.inputDigits = 0),
            (this.decimalMark = !1),
            this.updateDisplay();
    },
    init: function () {
        (this.display.style.lineHeight = +this.display.offsetHeight + "px"),
            document.addEventListener("mousedown", this),
            document.addEventListener("touchstart", function (t) {
                var e = t.target;
                ("value" != e.dataset.type && "C" != e.value && "=" != e.value) || e.classList.add("active");
            }),
            document.addEventListener("touchend", function (t) {
                var e = t.target;
                ("value" != e.dataset.type && "C" != e.value && "=" != e.value) || e.classList.remove("active");
            }),
            this.updateDisplay();
    },
    removeCurrentOperationEle: function () {
        this.currentOperationEle && (this.currentOperationEle.classList.remove("active"), (this.currentOperationEle = null));
    },
    handleEvent: function (t) {
        var e = t.target,
            i = e.value;
        switch ((navigator.vibrate(50), e.dataset.type)) {
            case "value":
                this.appendDigit(i);
                break;
            case "operator":
                if ("-" === i && "-" === this.currentInput) return;
                this.removeCurrentOperationEle(), (this.currentInput || this.result) && e.classList.add("active"), (this.currentOperationEle = e), (this.currentInput || this.result || "-" === i) && this.appendOperator(i);
                break;
            case "command":
                switch (i) {
                    case "=":
                        this.currentInput && this.operationToBeApplied && "number" == typeof this.result && (this.removeCurrentOperationEle(), this.calculate());
                        break;
                    case "C":
                        this.removeCurrentOperationEle(), this.backSpace();
                }
        }
    },
};
(Calculator.maxDisplayableValue = "1e" + Calculator.significantDigits - 1),
    window.addEventListener("load", function t(e) {
        window.removeEventListener("load", t), Calculator.init();
    });
