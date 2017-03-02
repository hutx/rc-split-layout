import React from 'react';
import Pane from './Pane';
import '../stylesheets/index.css';

function clearSelection() {
  if (window.getSelection) {
    if (window.getSelection().empty) {
      window.getSelection().empty();
    } else if (window.getSelection().removeAllRanges) {
      window.getSelection().removeAllRanges();
    }
  } else if (document.selection) {
    document.selection.empty();
  }
}

const DEFAULT_SPLITTER_SIZE = 4;

class SplitLayout extends React.Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleSplitterMouseDown = this.handleSplitterMouseDown.bind(this);
    this.state = {
      secondaryPaneSize: 0,
      resizing: false
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    document.addEventListener('mouseup', this.handleMouseUp);
    document.addEventListener('mousemove', this.handleMouseMove);

    let secondaryPaneSize;
    if (typeof this.props.secondaryInitialSize !== 'undefined') {
      secondaryPaneSize = this.props.secondaryInitialSize;
    } else {
      const containerRect = this.container.getBoundingClientRect();
      let splitRect;
      if (this.split) {
        splitRect = this.split.getBoundingClientRect();
      } else {
        // Simulate a split
        splitRect = { width: DEFAULT_SPLITTER_SIZE, height: DEFAULT_SPLITTER_SIZE };
      }
      secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitRect, {
        left: containerRect.left + ((containerRect.width - splitRect.width) / 2),
        top: containerRect.top + ((containerRect.height - splitRect.height) / 2)
      }, false);
    }
    this.setState({ secondaryPaneSize });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mouseup', this.handleMouseUp);
    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  getSecondaryPaneSize(containerRect, splitRect, clientPosition, offsetMouse) {
    let totalSize;
    let splitSize;
    let offset;
    if (this.props.vertical) {
      totalSize = containerRect.height;
      splitSize = splitRect.height;
      offset = clientPosition.top - containerRect.top;
    } else {
      totalSize = containerRect.width;
      splitSize = splitRect.width;
      offset = clientPosition.left - containerRect.left;
    }
    if (offsetMouse) {
      offset -= splitSize / 2;
    }
    if (offset < 0) {
      offset = 0;
    } else if (offset > totalSize - splitSize) {
      offset = totalSize - splitSize;
    }

    let secondaryPaneSize;
    if (this.props.primaryIndex === 1) {
      secondaryPaneSize = offset;
    } else {
      secondaryPaneSize = totalSize - splitSize - offset;
    }
    let primaryPaneSize = totalSize - splitSize - secondaryPaneSize;
    if (this.props.percentage) {
      secondaryPaneSize = (secondaryPaneSize * 100) / totalSize;
      primaryPaneSize = (primaryPaneSize * 100) / totalSize;
      splitSize = (splitSize * 100) / totalSize;
      totalSize = 100;
    }

    if (primaryPaneSize < this.props.primaryMinSize) {
      secondaryPaneSize = Math.max(secondaryPaneSize - (this.props.primaryMinSize - primaryPaneSize), 0);
    } else if (secondaryPaneSize < this.props.secondaryMinSize) {
      secondaryPaneSize = Math.min(totalSize - splitSize - this.props.primaryMinSize, this.props.secondaryMinSize);
    }

    return secondaryPaneSize;
  }

  handleResize() {
    if (this.split && !this.props.percentage) {
      const containerRect = this.container.getBoundingClientRect();
      const splitRect = this.split.getBoundingClientRect();
      const secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitRect, {
        left: splitRect.left,
        top: splitRect.top
      }, false);
      this.setState({ secondaryPaneSize });
    }
  }

  handleMouseMove(e) {
    if (this.state.resizing) {
      const containerRect = this.container.getBoundingClientRect();
      const splitRect = this.split.getBoundingClientRect();
      const secondaryPaneSize = this.getSecondaryPaneSize(containerRect, splitRect, {
        left: e.clientX,
        top: e.clientY
      }, true);
      clearSelection();
      this.setState({ secondaryPaneSize });
      if(this.props.onChange){
        this.props.onChange(secondaryPaneSize);
      }
    }
  }

  handleSplitterMouseDown() {
    clearSelection();
    this.setState({ resizing: true });
  }

  handleMouseUp() {
    this.setState({ resizing: false });
  }

  render() {
    let containerClasses = 'split-layout';
    if (this.props.customClassName) {
      containerClasses += ` ${this.props.customClassName}`;
    }
    if (this.props.vertical) {
      containerClasses += ' split-layout-vertical';
    }
    if (this.state.resizing) {
      containerClasses += ' layout-changing';
    }

    const children = React.Children.toArray(this.props.children).slice(0, 2);
    if (children.length === 0) {
      children.push(<div />);
    }
    const wrappedChildren = [];
    const primaryIndex = (this.props.primaryIndex !== 0 && this.props.primaryIndex !== 1) ? 0 : this.props.primaryIndex;
    for (let i = 0; i < children.length; ++i) {
      let primary = true;
      let size = null;
      if (children.length > 1 && i !== primaryIndex) {
        primary = false;
        size = this.state.secondaryPaneSize;
      }
      wrappedChildren.push(
        <Pane vertical={this.props.vertical} percentage={this.props.percentage} primary={primary} size={size}>
          {children[i]}
        </Pane>
      );
    }

    return (
      <div className={containerClasses} ref={(c) => { this.container = c; }}>
        {wrappedChildren[0]}
        {wrappedChildren.length > 1 &&
          <div
            className="layout-split"
            ref={(c) => { this.split = c; }}
            onMouseDown={this.handleSplitterMouseDown}
          />
        }
        {wrappedChildren.length > 1 && wrappedChildren[1]}
      </div>
    );
  }
}

SplitLayout.propTypes = {
  customClassName: React.PropTypes.string,
  vertical: React.PropTypes.bool,
  percentage: React.PropTypes.bool,
  primaryIndex: React.PropTypes.number,
  primaryMinSize: React.PropTypes.number,
  secondaryInitialSize: React.PropTypes.number,
  secondaryMinSize: React.PropTypes.number,
  onChange: React.PropTypes.func,
  children: React.PropTypes.arrayOf(React.PropTypes.node)
};

SplitLayout.defaultProps = {
  customClassName: '',
  vertical: false,
  percentage: false,
  primaryIndex: 0,
  primaryMinSize: 0,
  secondaryInitialSize: undefined,
  secondaryMinSize: 0,
  children: []
};

export default SplitLayout;
