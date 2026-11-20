// src/components/Navbar.js
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import logodisc from '../assets/images/logo/disc.png'
import './News.scss';
import YouTubePosts from '../components/News/YouTubePosts';

const News = ( {articles} ) => {
    return(
        <div>
            <head><script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3081463517624663"
     crossOrigin="anonymous"></script></head>
            <Navbar />
            <div className="news">
            <div className="image-container">
            <a href="https://discord.com/invite/BHzGzExyq5"><img
              src={logodisc}
              alt=""
              
            /></a>
      </div>
            <YouTubePosts />
                </div>
            <Footer />
        </div>
    )
};

export default News;
