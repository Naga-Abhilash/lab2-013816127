import React, { Component, PureComponent } from 'react';
import Navbar from '../Navbar/navbar';
import RestCard from './restCards';
import LeftPanel from './leftPanel';
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import rootUrl from '../config/settings';
import cookie from 'react-cookies';
import './cardstyles.css';
import styles from './paginationStyle.css'
import Pages from './pages'

class searchResults extends Component {
    constructor() {
        super()
        this.state = {
            restSearchResults: "",
            restCuisineResults: "",
            uniquecuisines: "",
            restaurantsByPages: "",
            restCuisinePages: "",
            pageNumber: 0
        }
    }

    componentDidMount() {
        if (localStorage.getItem("restaurantResults")) {
            let restResultsBySearch = localStorage.getItem("restaurantResults")
            let restDetails = JSON.parse(restResultsBySearch);
            let restByPages = restDetails
            console.log(restByPages.length);

            let totalRest = restByPages.length
            let pagerest = new Array(Math.floor(totalRest / 3) + 1)

            for (let i = 0; i < pagerest.length; i++) {
                pagerest[i] = new Array(3);
            }

            let h = 0
            for (let i = 0; i < (Math.floor(totalRest / 3) + 1); i++) {
                for (let j = 0; j < 3; j++) {
                    pagerest[i][j] = restByPages[h++];
                }
                console.log(pagerest[i]);

            }


            console.log(restDetails)

            let cuisineDetails = JSON.parse(localStorage.getItem("restaurantResults"));
            let lookup = {};
            let items = cuisineDetails;
            let result = [];

            for (let item, i = 0; item = items[i++];) {
                let itemtype = item.cuisineName;

                if (!(itemtype in lookup)) {
                    lookup[itemtype] = 1;
                    result.push(itemtype);
                }
            }
            console.log(result)
            result.sort()
            this.setState({
                uniquecuisines: result,
                restSearchResults: restDetails,
                restaurantsByPages: pagerest
            })
            if (localStorage.getItem("restCuisineDetails")) {
                let restResultsBySearch = localStorage.getItem("restCuisineDetails")
                let restDetails = JSON.parse(restResultsBySearch);
                let restByPages = restDetails
                console.log(restByPages);

                let totalRest = restByPages.length
                console.log(totalRest);

                let pagerest = new Array(Math.floor(totalRest / 3) + 1)

                for (let i = 0; i < pagerest.length; i++) {
                    pagerest[i] = new Array(3);
                }

                let h = 0
                for (let i = 0; i < ((totalRest) % 3); i++) {
                    for (let j = 0; j < 3; j++) {
                        if (restByPages[h]) {
                            pagerest[i][j] = restByPages[h++];
                            console.log(h);

                        }
                    }
                    console.log(pagerest[i]);

                }

                this.setState({
                    restCuisinePages: pagerest,
                    restCuisineResults: restDetails
                })
            }
        }
    }


    visitRestaurant = (restId) => {
        console.log("in VisitRestaurant method");
        console.log(restId)

        const data = {
            restId: restId,
            userEmail: localStorage.getItem('userEmail')
        }
        axios.post(rootUrl + '/restaurant/itemsByRestaurant', data)
            .then(response => {
                console.log(response)
                if (response.status === 200) {
                    let itemDetails = JSON.stringify(response.data)
                    console.log(response.data);

                    localStorage.setItem('itemsByRestaurant', itemDetails)
                    console.log("itemDetails:" + typeof itemDetails)
                    this.props.history.push('/resthome')
                }
                else {
                    console.log("Didn't fetch items data")
                }
            })

    }
    visitCuisine = (cuisineName) => {
        //e.preventDefault()
        console.log("in VisitCuisine method");
        console.log(cuisineName);

        //console.log(copyResults[id])
        let itemName = localStorage.getItem("itemName")
        const data = {
            cuisineName: cuisineName,
            itemName: itemName,
            userEmail: localStorage.getItem('userEmail')
        }
        console.log(data)
        if (data.cuisineName) {
            axios.post(rootUrl + '/restaurant/restaurantsbyItemCuisine', data)
                .then(response => {
                    console.log(response)
                    if (response.status === 200) {
                        let restCuisineDetails = JSON.stringify(response.data)
                        console.log(response.data);

                        localStorage.setItem('restCuisineDetails', restCuisineDetails)
                        console.log("itemDetails:" + restCuisineDetails)
                        window.location.reload();
                    }
                    else {
                        console.log("Didn't fetch items data")
                    }
                })
        }
        else {
            alert("Please try again")
        }
    }

    makeRequestWithPage = (number) => {
        console.log("in requests with page", number);
        this.setState({
            pageNumber: number
        })

    }

    render() {
        let pageNumbers = []
        let redirectVar = null;
        if (localStorage.getItem("accountType") !== '1') {
            redirectVar = <Redirect to="/login" />
        }

        if (!cookie.load('cookie')) {
            redirectVar = <Redirect to="/login" />
        }
        let route = null
        if (this.state.restCuisinePages) {
            route = this.state.restCuisinePages;

            let k = this.state.restCuisinePages.length
            let i = 0;
            while (k > 0) {
                pageNumbers.push(i)
                i++;
                k--;
            }
            console.log(pageNumbers);

            localStorage.removeItem("restCuisineDetails")
        }
        else if (this.state.restaurantsByPages) {
            route = this.state.restaurantsByPages;
            let k = this.state.restaurantsByPages.length
            let i = 0;
            while (k > 0) {
                pageNumbers.push(i)
                i++;
                k--;
            }
        }
        console.log(route);

        if (route) {
            let restCards = route[this.state.pageNumber].map((restaurant, index) => {
                if (restaurant) {
                    return (
                        <RestCard
                            key={restaurant.restId}
                            restIndividual={restaurant}
                            index={index}
                            visitRest={this.visitRestaurant.bind(this)}
                        />
                    )
                }
            })

            let cuisinePanel = this.state.uniquecuisines.map((cuisine, ind) => {
                return (
                    <LeftPanel
                        key={cuisine}
                        cuisineIndividual={cuisine}
                        visitCuisine={this.visitCuisine.bind(this)}
                    />
                )
            })

            let renderPageNumbers = ""
            if (pageNumbers.length > 1) {
                renderPageNumbers = pageNumbers.map(number => {
                    let classes = this.state.pageNumber === number ? 'active' : '';

                    return (
                        <span key={number} className={classes} onClick={() => this.makeRequestWithPage(number)}>{number}</span>
                    );
                });
            }

            return (
                <div>
                    {redirectVar}
                    <Navbar />
                    <div>
                        <div className="restLeft" id="left">
                            <div className="list-group">
                                {cuisinePanel}
                            </div>
                        </div>
                        <div id="right">
                            <div id="search-results-text"><p>Your Search Results....</p></div>
                            <div className="card-group" >
                                {restCards}
                            </div>
                            <div className='pagination'>
                                {renderPageNumbers}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        else {
            return (
                <div>
                    <Navbar />
                    {redirectVar}
                    <h3>No Items found. </h3>
                </div>
            );
        }
    }
}

export default searchResults;