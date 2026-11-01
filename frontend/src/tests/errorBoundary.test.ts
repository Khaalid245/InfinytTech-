import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

describe('ErrorBoundary Component', () => {
  it('getDerivedStateFromError updates state to hasError: true with the caught error', () => {
    const testError = new Error('Render crash simulation');
    const state = ErrorBoundary.getDerivedStateFromError(testError);

    assert.strictEqual(state.hasError, true);
    assert.strictEqual(state.error, testError);
  });

  it('handleReset restores clean state and triggers onReset callback', () => {
    let resetCallbackCalled = false;
    const boundary = new ErrorBoundary({
      children: React.createElement('div', null, 'Child Content'),
      onReset: () => {
        resetCallbackCalled = true;
      },
    });

    boundary.state = {
      hasError: true,
      error: new Error('Previous error'),
    };

    boundary.handleReset();

    assert.strictEqual(boundary.state.hasError, false);
    assert.strictEqual(boundary.state.error, null);
    assert.strictEqual(resetCallbackCalled, true);
  });

  it('renders children normally when no error has occurred', () => {
    const childNode = React.createElement('span', { id: 'child-element' }, 'Active Child');
    const boundary = new ErrorBoundary({
      children: childNode,
    });

    const rendered = boundary.render();
    assert.strictEqual(rendered, childNode);
  });

  it('renders custom function fallback with error details when error occurs', () => {
    const testError = new Error('Custom error trigger');
    const boundary = new ErrorBoundary({
      children: React.createElement('div', null, 'Normal child'),
      fallback: (err, _reset) =>
        React.createElement(
          'div',
          { id: 'custom-fallback' },
          `Caught: ${err.message}`
        ),
    });

    boundary.state = {
      hasError: true,
      error: testError,
    };

    const rendered = boundary.render() as React.ReactElement<{ id: string; children: string }>;
    assert.ok(rendered);
    assert.strictEqual(rendered.props.id, 'custom-fallback');
    assert.strictEqual(rendered.props.children, 'Caught: Custom error trigger');
  });

  it('renders default branded recovery screen with role="alert" when error occurs and no custom fallback is set', () => {
    const testError = new Error('System failure');
    const boundary = new ErrorBoundary({
      children: React.createElement('div', null, 'Normal child'),
    });

    boundary.state = {
      hasError: true,
      error: testError,
    };

    const rendered = boundary.render() as React.ReactElement<{ role: string }>;
    assert.ok(rendered);
    assert.strictEqual(rendered.props.role, 'alert');
  });
});
