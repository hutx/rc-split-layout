import jsdomify from 'jsdomify';
jsdomify.create();
import expect from 'expect';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import SplitLayout from '../src/components/SplitLayout';
import Pane from '../src/components/Pane';

function setupSplitLayout(itemCount, props) {
  props = props || {};
  const children = [];
  for (let i = 0; i < itemCount; ++i) {
    children.push(<div key={i}>Child #{i}</div>);
  }
  const renderer = TestUtils.createRenderer();
  renderer.render(<SplitLayout {...props}>{children}</SplitLayout>);
  const output = renderer.getRenderOutput();
  return { props, output, renderer };
}

function setupSplitLayoutInDOM(itemCount, props) {
  props = props || {};
  const children = [];
  for (let i = 0; i < itemCount; ++i) {
    children.push(<div key={i}>Child #{i}</div>);
  }
  const component = TestUtils.renderIntoDocument(<SplitLayout {...props}>{children}</SplitLayout>);
  return { props, component };
}

describe('SplitLayout', () => {
  describe('rendering', () => {
    it('should render correctly when 2 children provided', () => {
      const { output } = setupSplitLayout(2);
      expect(output.type).toBe('div');
      expect(output.props.className).toBe('split-layout');
      expect(output.props.children.length).toBe(3);
      expect(output.props.children[0].type).toBe(Pane);
      expect(output.props.children[0].props.vertical).toBe(false);
      expect(output.props.children[0].props.primary).toBe(true);
      expect(output.props.children[0].props.percentage).toBe(false);
      expect(output.props.children[1].type).toBe('div');
      expect(output.props.children[1].props.className).toBe('layout-split');
      expect(output.props.children[2].type).toBe(Pane);
      expect(output.props.children[2].props.vertical).toBe(false);
      expect(output.props.children[2].props.primary).toBe(false);
      expect(output.props.children[2].props.percentage).toBe(false);
    });

    it('should render properties correctly if requested', () => {
      const { output } = setupSplitLayout(2, {
        customClassName: 'custom-class',
        vertical: true,
        percentage: true,
        primaryIndex: 1
      });
      expect(output.type).toBe('div');
      expect(output.props.className).toBe('split-layout custom-class split-layout-vertical');
      expect(output.props.children.length).toBe(3);
      expect(output.props.children[0].type).toBe(Pane);
      expect(output.props.children[0].props.vertical).toBe(true);
      expect(output.props.children[0].props.primary).toBe(false);
      expect(output.props.children[0].props.percentage).toBe(true);
      expect(output.props.children[1].type).toBe('div');
      expect(output.props.children[1].props.className).toBe('layout-split');
      expect(output.props.children[2].type).toBe(Pane);
      expect(output.props.children[2].props.vertical).toBe(true);
      expect(output.props.children[2].props.primary).toBe(true);
      expect(output.props.children[2].props.percentage).toBe(true);
    });

    it('should set the first children as primary if invalid primary index is provided', () => {
      const { output } = setupSplitLayout(2, {
        primaryIndex: 5
      });
      expect(output.type).toBe('div');
      expect(output.props.className).toBe('split-layout');
      expect(output.props.children.length).toBe(3);
      expect(output.props.children[0].type).toBe(Pane);
      expect(output.props.children[0].props.vertical).toBe(false);
      expect(output.props.children[0].props.primary).toBe(true);
      expect(output.props.children[0].props.percentage).toBe(false);
      expect(output.props.children[1].type).toBe('div');
      expect(output.props.children[1].props.className).toBe('layout-split');
      expect(output.props.children[2].type).toBe(Pane);
      expect(output.props.children[2].props.vertical).toBe(false);
      expect(output.props.children[2].props.primary).toBe(false);
      expect(output.props.children[2].props.percentage).toBe(false);
    });

    it('should render one child when nothing provided', () => {
      const { output } = setupSplitLayout(0);
      expect(output.type).toBe('div');
      expect(output.props.className).toBe('split-layout');
      expect(output.props.children.length).toBe(3);
      expect(output.props.children[0].type).toBe(Pane);
      expect(output.props.children[0].props.vertical).toBe(false);
      expect(output.props.children[0].props.primary).toBe(true);
      expect(output.props.children[0].props.percentage).toBe(false);
      expect(output.props.children[1]).toBe(false);
      expect(output.props.children[2]).toBe(false);
    });

    it('should render one child when only 1 child provided', () => {
      const { output } = setupSplitLayout(1);
      expect(output.type).toBe('div');
      expect(output.props.className).toBe('split-layout');
      expect(output.props.children.length).toBe(3);
      expect(output.props.children[0].type).toBe(Pane);
      expect(output.props.children[0].props.vertical).toBe(false);
      expect(output.props.children[0].props.primary).toBe(true);
      expect(output.props.children[0].props.percentage).toBe(false);
      expect(output.props.children[1]).toBe(false);
      expect(output.props.children[2]).toBe(false);
    });

    it('should render 2 children when more than 2 children provided', () => {
      const { output } = setupSplitLayout(5);
      expect(output.type).toBe('div');
      expect(output.props.className).toBe('split-layout');
      expect(output.props.children.length).toBe(3);
      expect(output.props.children[0].type).toBe(Pane);
      expect(output.props.children[0].props.vertical).toBe(false);
      expect(output.props.children[0].props.primary).toBe(true);
      expect(output.props.children[0].props.percentage).toBe(false);
      expect(output.props.children[1].type).toBe('div');
      expect(output.props.children[1].props.className).toBe('layout-split');
      expect(output.props.children[2].type).toBe(Pane);
      expect(output.props.children[2].props.vertical).toBe(false);
      expect(output.props.children[2].props.primary).toBe(false);
      expect(output.props.children[2].props.percentage).toBe(false);
    });
  });

  describe('sizing', () => {
    it('should get correct secondary pane size when horizontal, pixel sizing and first child as primary', () => {
      const component = {
        props: {
          vertical: false,
          percentage: false,
          primaryIndex: 0,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 4, height: 512 };
      const position = { left: 50, top: 200 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(972);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(970);
    });

    it('should get correct secondary pane size when vertical, pixel sizing and first child as primary', () => {
      const component = {
        props: {
          vertical: true,
          percentage: false,
          primaryIndex: 0,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 40, left: 0, width: 1024, height: 4 };
      const position = { left: 50, top: 200 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(310);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(308);
    });

    it('should get correct secondary pane size when horizontal, percentage sizing and first child as primary', () => {
      const component = {
        props: {
          vertical: false,
          percentage: true,
          primaryIndex: 0,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 4, height: 512 };
      const position = { left: 512, top: 128 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(49.8046875);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(49.609375);
    });

    it('should get correct secondary pane size when vertical, percentage sizing and first child as primary', () => {
      const component = {
        props: {
          vertical: true,
          percentage: true,
          primaryIndex: 0,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 512, height: 4 };
      const position = { left: 512, top: 128 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(74.609375);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(74.21875);
    });

    it('should get correct secondary pane size when horizontal, pixel sizing and second child as primary', () => {
      const component = {
        props: {
          vertical: false,
          percentage: false,
          primaryIndex: 1,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 4, height: 512 };
      const position = { left: 50, top: 200 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(48);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(50);
    });

    it('should get correct secondary pane size when vertical, pixel sizing and second child as primary', () => {
      const component = {
        props: {
          vertical: true,
          percentage: false,
          primaryIndex: 1,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 40, left: 0, width: 1024, height: 4 };
      const position = { left: 50, top: 200 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(198);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(200);
    });

    it('should get correct secondary pane size when horizontal, percentage sizing and second child as primary', () => {
      const component = {
        props: {
          vertical: false,
          percentage: true,
          primaryIndex: 1,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 4, height: 512 };
      const position = { left: 512, top: 128 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(49.8046875);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(50);
    });

    it('should get correct secondary pane size when vertical, percentage sizing and second child as primary', () => {
      const component = {
        props: {
          vertical: true,
          percentage: true,
          primaryIndex: 1,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 512, height: 4 };
      const position = { left: 512, top: 128 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(24.609375);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(25);
    });

    it('should adjust the pane size when exceeds limit', () => {
      const component = {
        props: {
          vertical: false,
          percentage: false,
          primaryIndex: 0,
          primaryMinSize: 0,
          secondaryMinSize: 0
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 4, height: 512 };
      expect(getSecondaryPaneSize(containerRect, splitRect, { left: -10, top: 200 }, true)).toBe(1020);
      expect(getSecondaryPaneSize(containerRect, splitRect, { left: -10, top: 200 }, false)).toBe(1020);
      expect(getSecondaryPaneSize(containerRect, splitRect, { left: 1050, top: 200 }, true)).toBe(0);
      expect(getSecondaryPaneSize(containerRect, splitRect, { left: 1050, top: 200 }, false)).toBe(0);
    });

    it('should respect user setting of secondary pane minimal size', () => {
      const component = {
        props: {
          vertical: false,
          percentage: false,
          primaryIndex: 0,
          primaryMinSize: 0,
          secondaryMinSize: 200
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 4, height: 512 };
      const position = { left: 1024, top: 200 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(200);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(200);
    });

    it('should respect primary pane minimal size over secondary pane minimal size', () => {
      const component = {
        props: {
          vertical: false,
          percentage: false,
          primaryIndex: 0,
          primaryMinSize: 600,
          secondaryMinSize: 600
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 4, height: 512 };
      expect(getSecondaryPaneSize(containerRect, splitRect, { left: 500, top: 200 }, true)).toBe(420);
      expect(getSecondaryPaneSize(containerRect, splitRect, { left: 500, top: 200 }, false)).toBe(420);
      expect(getSecondaryPaneSize(containerRect, splitRect, { left: 900, top: 200 }, true)).toBe(420);
      expect(getSecondaryPaneSize(containerRect, splitRect, { left: 900, top: 200 }, false)).toBe(420);
    });

    it('should respect primary pane minimal size over secondary pane minimal size when width is not enough', () => {
      const component = {
        props: {
          vertical: false,
          percentage: false,
          primaryIndex: 0,
          primaryMinSize: 1200,
          secondaryMinSize: 200
        }
      };
      const getSecondaryPaneSize = SplitLayout.prototype.getSecondaryPaneSize.bind(component);
      const containerRect = { top: 0, left: 0, width: 1024, height: 512 };
      const splitRect = { top: 0, left: 40, width: 4, height: 512 };
      const position = { left: 200, top: 200 };
      expect(getSecondaryPaneSize(containerRect, splitRect, position, true)).toBe(0);
      expect(getSecondaryPaneSize(containerRect, splitRect, position, false)).toBe(0);
    });
  });

  describe('DOM', () => {
    it('should set split reference when it is rendered', () => {
      const windowSpy = expect.spyOn(window, 'addEventListener');
      const documentSpy = expect.spyOn(document, 'addEventListener');
      const { component } = setupSplitLayoutInDOM(2);
      expect(windowSpy.calls.length).toBeGreaterThan(1);
      expect(windowSpy.calls[windowSpy.length - 1].arguments[0]).toEqual('resize');
      expect(documentSpy.calls.length).toBeGreaterThan(2);
      expect(documentSpy.calls[documentSpy.calls.length - 2].arguments[0]).toEqual('mouseup');
      expect(documentSpy.calls[documentSpy.calls.length - 1].arguments[0]).toEqual('mousemove');
      expect(component.container).toExist();
      expect(component.split).toExist();
    });

    it('should not set split reference when it is not rendered', () => {
      const { component } = setupSplitLayoutInDOM(1);
      expect(component.container).toExist();
      expect(component.split).toNotExist();
    });

    it('should set state when trying to drag split', () => {
      const { component } = setupSplitLayoutInDOM(2);
      expect(component.state.resizing).toBe(false);
      TestUtils.Simulate.mouseDown(component.split);
      expect(component.state.resizing).toBe(true);
    });

    it('should initialize horizontal secondary size if requested even when split is not rendered', () => {
      const { component } = setupSplitLayoutInDOM(1, { secondaryInitialSize: 20 });
      expect(component.state.secondaryPaneSize).toBe(20);
    });

    it('should initialize vertical secondary size if requested even when split is not rendered', () => {
      const { component } = setupSplitLayoutInDOM(1, { secondaryInitialSize: 20, vertical: true });
      expect(component.state.secondaryPaneSize).toBe(20);
    });
  });
});
