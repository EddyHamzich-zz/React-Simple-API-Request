import React, { Component } from 'react';

export default class SimpleRequestComponent extends Component {

    state = {
        loading: true,
        stocksApi: []
    };

    async componentDidMount() {

        await Promise.all(
            [
            // Yes you can use my API key to test this component, its free & rate limited so I dont care!
            fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=TSLA&apikey=LOL`).then(data => data.json()),
            fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=AAPL&apikey=LOL`).then(data => data.json())
            ]
        )
        .then(([TSLA, AAPL]) => {

            // Log data before doing anything so we can see the json structure!
            console.log({TSLA, AAPL});
        
            /*
            According to the API docs "Global Quote" should ALWAYS be the 1st key in the object!
            Check if data object's first key is NOT "Global Quote" (that means we got an error / wrong data)!
            Also check if the object is empty!
            */
            [TSLA, AAPL].some(key => !("Global Quote" in key))
            ||
            [TSLA, AAPL].some(obj => Object.keys(obj).length === 0)
            ? 
            (this.setState({ loading: true }))
            :
            (this.setState({ loading: false, stocksApi:{TSLA, AAPL} }));

            console.log(this.state.stocksApi); // Log data again to see if its actually inside our state!
            
        })
    };

    render() {

        // API data shortcuts
        const TSLA = this.state.stocksApi.TSLA;
        const AAPL = this.state.stocksApi.AAPL;

        return (
            <ul>
                <li className="tesla-container">
                    { this.state.loading ? (<div>Loading...</div>) : (<div className="stock-name">{ TSLA["Global Quote"]["01. symbol"] }</div>) }
                    { this.state.loading ? (<div>Loading...</div>) : (<div className="stock-price">$ { TSLA["Global Quote"]["05. price"] }</div>) }
                </li>
                <li className="apple-container">
                    { this.state.loading ? (<div>Loading...</div>) : (<div className="stock-name">{ AAPL["Global Quote"]["01. symbol"] }</div>) }
                    { this.state.loading ? (<div>Loading...</div>) : (<div className="stock-price">$ { AAPL["Global Quote"]["05. price"] }</div>) }
                </li>
            </ul>
        )
    }
};
