# rc-split-layout


A simple split layout for React and modern browsers.


## Dependencies

rc-split-layout depends on React. See [package.json](package.json) for more details.

## Installation

```sh
$ npm install --save rc-split-layout
```

## Testing

To run tests, execute `test` command with `npm`.

```sh
$ npm test
```

To run coverage tests, execute `coverage` script with `npm`.

```sh
$ npm run coverage
```

## Integration

1. Add `rc-split-layout` dependency to your code.

    ```sh
    $ npm install --save react-split-layout
    ```

2. Include the library into your code and use it.

    ```javascript
    import React from 'react';
    import SplitLayout from 'rc-split-layout';
    
    class YourComponent extends React.Component {
      handleSplitChange(v){
          console.log(v);
      }  
      render() {
        return (
          <SplitLayout onChange={this.handleSplitChange.bind(this)}>
            <div>Pane 1</div>
            <div>Pane 2</div>
          </SplitLayout>
        );
      }
    }
 
    export default YourComponent;
    ```

## Usage

Write two parts of the layout as direct children of your `SplitLayout` element.
`SplitLayout` renders the first 2 direct children only if it has more than 2 direct children.
`SplitLayout` does not render splitter when it has only 1 direct children,
and the only direct children occupies all available space.

The `SplitLayout` component supports the following props.

* `customClassName: React.PropTypes.string`

    Custom CSS class name applied to the layout `div`. You can use this to customize layout style.
    Refers to the [original stylesheet](src/stylesheets/index.css) to see what you can customize.

* `vertical: React.PropTypes.bool`

    Determine whether the layout should be a horizontal split or a vertical split. The default value is `false`.
    
* `percentage: React.PropTypes.bool`

    Determine whether the width of each pane should be calculated in percentage or by pixels.
    The default value is `false`, which means width is calculated in pixels.
    
* `primaryIndex: React.PropTypes.number`

    Index of the *primary pane*. Since `SplitterLayout` supports at most 2 children, only `0` or `1` is allowed.
    The default value is `0`.
    
    A *primary pane* is used to show users primary content, while a *secondary pane* is the other pane.
    When window size changes and `percentage` is set to `false`,
    primary pane's size is flexible and secondary pane's size is kept unchanged.
    However, when the window size is not enough for showing both minimal primary pane and minimal secondary pane,
    the primary pane's size is served first. 

* `primaryMinSize: React.PropTypes.number`

    Minimal size of primary pane. The default value is 0.

    When `percentage` is set to `false`, this value is pixel size (25 means 25px).
    When `percentage` is set to `true`, this value is percentage (25 means 25%).
    
* `secondaryMinSize: React.PropTypes.number`

    Minimal size of secondary pane.

* `secondaryInitialSize: React.PropTypes.number`

    Initial size of secondary pane when page loads.
    
    If this prop is not defined, `SplitterLayout` tries to split the layout with equal sizes.
    (Note: equal size may not apply when there are nested layouts.)

* `onChange`

    return secondary size.

## License

[MIT](LICENSE)
