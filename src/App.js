import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const App = () => {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [periodInYears, setPeriodInYears] = useState("");
  const [results, setResults] = useState(null);
  const [calculateLoanErrors, setCalculateLoanErrors] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/loan/calculate", {
        principal: parseFloat(principal),
        interestRate: parseFloat(interestRate),
        periodInYears: parseInt(periodInYears, 10),
      });
      setMessage(response.data.message);
      setResults(response.data.data);
      setCalculateLoanErrors(null); // Clear errors on success
    } catch (error) {
      setMessage(error.response.data.message);
      setCalculateLoanErrors(error.response.data.errors);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Loan Calculator</h1>
      {message && (
        <div className="row">
          <div className="col-12">
            <div className={calculateLoanErrors ? "alert alert-danger" : "alert alert-success"} role="alert">
              {message}
            </div>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb-3">
          <label htmlFor="principal">Loan Amount (Principal $):</label>
          <input
            id="principal"
            type="number"
            className="form-control"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            required
          />
          {calculateLoanErrors?.principal && (
            <small className="text-danger">{calculateLoanErrors.principal}</small>
          )}
        </div>
        <div className="form-group mb-3">
          <label htmlFor="interestRate">Interest Rate (% p.a):</label>
          <input
            id="interestRate"
            type="number"
            className="form-control"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            required
          />
          {calculateLoanErrors?.interestRate && (
            <small className="text-danger">{calculateLoanErrors.interestRate}</small>
          )}
        </div>
        <div className="form-group mb-3">
          <label htmlFor="periodInYears">Loan Period (Years):</label>
          <input
            id="periodInYears"
            type="number"
            className="form-control"
            value={periodInYears}
            onChange={(e) => setPeriodInYears(e.target.value)}
            required
          />
          {calculateLoanErrors?.periodInYears && (
            <small className="text-danger">{calculateLoanErrors.periodInYears}</small>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100">Calculate</button>
      </form>

      {results && (
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">Results</h2>
            <p className="card-text">Monthly Payment: ${results.monthlyPayment.toFixed(2)}</p>
            <p className="card-text">Weekly Payment: ${results.weeklyPayment.toFixed(2)}</p>
            <p className="card-text">Yearly Payment: ${results.yearlyPayment.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
