import React from "react"
import BodyClassName from "react-body-classname"
import sanitizeHtml from "sanitize-html"
import {Helmet} from "react-helmet"
import LoadedImageUrl from "components/utils/loaded-image-url"

import "components/styles/page-listings.scss"

import HeaderPortal from "components/header-portal"
import Icon from "components/icon"
import ListingsData from "data/listings.json"
import DatePicker from "components/date-picker/date-picker"

import * as imageURLs from "../images/listings/*.{png,jpg}"

const Listing = props => {
    const data = ListingsData.listings[props.id]
    const headerImageUrl = LoadedImageUrl(imageURLs, data.detailHeaderImageSrc)
    return (
        <BodyClassName className="header-overlap page-listing-detail">
            <>
                <HeaderPortal>
                    <h1 className="visually-hidden">CampSpots: {data.listingName}</h1>
                </HeaderPortal>
                <article>
                    <header
                        className="page-header"
                        style={{backgroundImage: `url(${headerImageUrl}`}}
                    >
                        <div className="page-header-content wide-layout">
                            <h1 className="listing-name">{data.listingName}</h1>
                            <p className="location">{data.location}</p>
                        </div>
                    </header>
                    <div className="wide-layout two-parts-70-30">
                        <div>
                            <section aria-label="Description">
                                <h2>Description</h2>
                                <div className="description-text" dangerouslySetInnerHTML={{__html: sanitizeHtml(data.description)}} />
                            </section>
                            <section aria-label="Amenities">
                                <h2>Amenities</h2>
                                <div className="amenity-icons grid">
                                {data.amenities.map((amenity, index) => {
                                    return <div key={index}>
                                        <Icon name={amenity} showText={true} />
                                    </div>
                                })}
                                </div>
                            </section>
                        </div>
                        <section aria-label="Booking Calendar">
                            <h2>Calendar</h2>
                            <DatePicker />
                        </section>
                    </div>
                    <section className="wide-layout" aria-label="Photo Gallery">
                        <h2>Photos</h2>
                        <div className="detail-images">
                            {data.detailImages.map((image, index) => {
                                let detailImageUrl = LoadedImageUrl(imageURLs, image.imageSrc)
                                return <img
                                    key={index}
                                    src={detailImageUrl}
                                    alt={image.imageAlt}
                                />
                            })}
                        </div>
                    </section>
                </article>
            </>
        </BodyClassName>
    )
}

export default Listing
