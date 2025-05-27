import React from 'react';
import './index.css';

class EnquirySlider extends React.Component {
  constructor(props) {
    super(props);
    this.sliderRef = React.createRef();
  }

  componentDidMount() {
    this.currentIndex = 0;
    this.moveInterval = setInterval(this.moveSlider, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.moveInterval);
  }

  moveSlider = () => {
    this.currentIndex = (this.currentIndex + 1) % Math.ceil(this.getCourseCounts().length / 3);
    this.sliderRef.current.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  };

  getCourseCounts = () => {
    const courseCounts = {};
    this.props.enquiries.forEach((enquiry) => {
      const { coursePreferred } = enquiry;
      courseCounts[coursePreferred.toUpperCase()] = (courseCounts[coursePreferred.toUpperCase()] || 0) + 1;
    });

    return Object.keys(courseCounts).map((course) => ({
      coursePreferred: course.toUpperCase(),
      count: courseCounts[course.toUpperCase()],
    }));
  };

  render() {
    const courseCounts = this.getCourseCounts();

    return (
      <div className="enquiry-slider-container">
        <div className="enquiry-slider" ref={this.sliderRef}>
          {courseCounts.map((course, index) => (
            <div className="enquiry-card" key={index}>
              <h3 className="enquiry-card-title">{course.coursePreferred}</h3>
              <p className="enquiry-card-count">{`Count: ${course.count}`}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default EnquirySlider;
