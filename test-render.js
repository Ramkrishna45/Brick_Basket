const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { Menu } = require('@base-ui/react/menu');

try {
  renderToStaticMarkup(
    React.createElement(Menu.Root, { open: true },
      React.createElement(Menu.Portal, {}, 
        React.createElement(Menu.Positioner, {},
          React.createElement(Menu.Popup, {},
            React.createElement(Menu.GroupLabel, {}, "Label"),
            React.createElement(Menu.Item, {}, "Item")
          )
        )
      )
    )
  );
  console.log("Success");
} catch (e) {
  console.log("Error:", e.message);
}
