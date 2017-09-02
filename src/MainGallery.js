
/**
 * Beautyland Project - Main Gallery
 */

import React, { Component } from 'react';
import Gallery from 'react-grid-gallery';

import PostDisplayer from './PostDisplayer';

import './MainGallery.css';

const basedata = [{
  images: [
    {url: "./images/icon_beautyland.jpg", width: 185, height: 194}
  ]
}];

export default class MainGallery extends Component {
  constructor(props){
    super(props);

    let url = null;
    if(props.location.pathname === '/trends'){
      url = 'https://beautyland-api.royvbtw.uk/trends';
    }else{
      url = 'https://beautyland-api.royvbtw.uk/latest';
    }

    window.addEventListener('scroll', this.scrollHandler);

    this.isLoadingData = false;

    this.state = {
      isGalleryMode: true,
      apiUrl: url,
      page: 0,
      postList: [],
      post: null,
      viewOffsetY: 0,
      disableBtnLoadmore: false
    }

    //this.loadMore(url);   //set up initial data
  }

  componentWillMount(){
    this.loadMore(this.state.apiUrl);
  }

  componentDidUpdate(){
    if(this.state.isGalleryMode){
      const offset = this.state.viewOffsetY;
      window.scroll(0, Math.ceil(offset));
    }else{
      //window.scroll(0, 0);
    }
  }

  componentWillUnmount(){
    console.log('willUnmount()');
    window.removeEventListener('scroll', this.scrollHandler);
  }

  isScrollIntoView = (ele) => {
    const top = ele.getBoundingClientRect().top;
    return (top <= window.innerHeight);
  };

  galleryClickHandler = (postIndex, event) => {
    this.updateViewCount(this.state.postList[postIndex].postId);
    this.setState({
      isGalleryMode: false,
      viewOffsetY: window.scrollY,
      post: this.state.postList[postIndex]
    });
  };


  /**
   * To build the image list which will be used in the Gallery component
   */
  getGalleryImageList = () => {
      let imageListForGallery = [];
      let postList = [];
      // if the props.postList does not load yet, use some default image instead.
      if(!this.state.postList){
        postList = basedata;
      }else{
        postList = this.state.postList;
      }
      postList.forEach( post => {
        //const imageListLength = (post.images)? post.images.length: post.imgUrls.length;
        //const imageIndex = Math.floor(Math.random() * imageListLength);
        const imageIndex = 0;
        if(post.images[imageIndex].length === 0){
          return;
        }
        const imageData = {};
        imageData.src = post.images[imageIndex].url;
        imageData.thumbnail = imageData.src;
        imageData.thumbnailWidth = (post.images[imageIndex].width)? post.images[imageIndex].width: 300;
        imageData.thumbnailHeight = (post.images[imageIndex].height)? post.images[imageIndex].height: 300;
        imageListForGallery.push(imageData);
      });
      return imageListForGallery;
    };

  goBackHandler = () => {
    this.setState({
      isGalleryMode: true
    });
  };

  /**
   * Send a get reuqest to Beautyland api for increase the view count for specified post
   */
  updateViewCount = (postId) => { // #todo
    const url = 'https://beautyland-api.royvbtw.uk/post/' + postId;
    fetch(url, {method: 'PUT'}).then();  // simply send put request
  };

  /**
   * Click event handler for loadMore button.
   */
  loadMore = (event) => {
    console.log('loadMore() started.');
    if(this.isLoadingData) return;
    
    const viewOffsetY = window.scrollY;
    const newPageNumber = this.state.page + 1;
    console.log('loadmore with page %s', newPageNumber);
    const url = this.state.apiUrl + '/' + newPageNumber;
    this.loadPostData(url);

    this.setState({
      viewOffsetY: viewOffsetY
    });
  };

  loadPostData = function(url){
    console.log('loadPostData, url=', url);
    this.isLoadingData = true;
    fetch(url).then( function(response){
      return response.json();   // note: json() returns a promise
    }).then(data => {
      if(data.length === 0){
        console.log('No more data');
        this.setState({
          disableBtnLoadmore: true
        });
      }else{
        let currentList = this.state.postList;
        currentList = currentList.concat(data);
        this.isLoadingData = false;
        const p = this.state.page;
        this.setState({
          page: p + 1,
          postList: currentList
        });
      }
      
    }).catch( err => {
      console.log(err.message);
    });
  };

  scrollHandler = () => {
    if(!this.isLoadingData && this.state.isGalleryMode){
      const btnLoadMore = document.getElementsByClassName('btnLoadmore')[0];
      const isButtonInView = this.isScrollIntoView(btnLoadMore);
      if(isButtonInView){
        this.loadMore();
      }
    }
    
    //console.log('scrollHandler, top=', btnLoadMore.getBoundingClientRect().top);
    //console.log('scrollHandler, bottom=', btnLoadMore.getBoundingClientRect().bottom);

  };

  render(){
    let content;
    if(this.state.isGalleryMode){
      content = (
        <div onClick={this.scrollHandler}>
          <Gallery images={this.getGalleryImageList()}
            rowHeight={250}
            enableImageSelection={false}
            onClickThumbnail={this.galleryClickHandler}
          />
          <div className='btnLoadmore' disabled={this.state.disableBtnLoadmore}>no more data</div>
        </div>
      );
    }else{
      content = (
        <PostDisplayer 
          post={this.state.post}
          goBackHandler={this.goBackHandler} 
        />
      );
    }
    return (
      <div>{content}</div>
    )
  }
}
