Questions:

1. What is the difference between Component and PureComponent? give an
example where it might break my app.

Сlean means allow us to avoid unnecessary renders, for example when we use a component - it will be redrawn every time the props are changed.
Сlean components help avoid this in the method shouldUpdate.
But the comparison only happens at the primitive level - problem with objects and arrays.

2. Context + ShouldComponentUpdate might be dangerous. Can think of
why is that?

Updating the context will always cause child components to be rendered. In this case, we will get two renders instead of one.

3. Describe 3 ways to pass information from a component to its PARENT.

- Callback with props
- Context/Redux
- Event-bus

4. Give 2 ways to prevent components from re-rendering.

- Use pure components
- Use memo pattern in React (useCallback, useMemo)

5. What is a fragment and why do we need it? Give an example where it
might break my app.

Fragments allows to create template with a lot of childs.
I think that fragments are inconvenient to optimize, this causes side effects on the component in which the fragments is used.

6. Give 3 examples of the HOC pattern.

- A HOC can wrap a component and expand its props.
- HOC allows to wrap all app and check all globas errors (like errorboundary).
- HOC allows you to control the rendering of a component in cases with asynchronous requests and responses.

7. what's the difference in handling exceptions in promises, callbacks and
async...await.

Async/await - we should use try/catch block and catch can help us to handle some error
In promises - we should use then/catch chain and catch can help us to handle some error too
In callbacks - error it is a first argument in callback-function arguments. If first argument is empty - all is fine

8. How many arguments does setState take and why is it async.

The setstate hook has two arguments, the first is the current state, the second is the asynchronous state change function.
SetState async because this is good for performance and we can group several setStates.

9. List the steps needed to migrate a Class to Function Component.

- remove class and write function
- remove constructor
- replace all functions to arrow functions
- remove render method
- add return in component-function for return template
- remove all life-cycle methods and use hoocks for this point (like useEffect)
- do not use this
- replace state and setState on useState hook
- use useMemo instead shouldUpdated method

10. List a few ways styles can be used with components.

- css styles in other file and import them
- use material useClasses hook
- can use global styles or inline styles
- use scoped classes for component (material useClasses hook can do it too)

11. How to render an HTML string coming from the server.

Use dangerouslySetInnerHTML BUT in this case React stopped sanitizing.
