PG.Components.BreadcrumbItem = React.createClass({displayName: "BreadcrumbItem",
  propTypes: {
    text: React.PropTypes.string,
    url: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    clickHandler: React.PropTypes.func,
    delimiterIcon: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      text: "Breadcrumb Item",
      url: "#"
    };
  },

  handleClick: function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.clickHandler && !this.props.disabled)
      this.props.clickHandler(this);
  },

  render: function render() {
    return (
      React.createElement("li", null, 
        React.createElement("a", {href: this.props.url, onClick: this.handleClick, disabled: this.props.disabled}, 
          this.getIcon(), 
          this.props.text, 
          this.getDelimiter()
        )
      )
    );
  },

  getIcon: function getIcon() {
    if (!this.props.icon) return;

    var classes = "icon icon-" + this.props.icon;
    return (React.createElement("span", {className: classes}));
  },

  getDelimiter: function getDelimiter() {
    if (this.props.disabled || !this.props.delimiterIcon) return;

    var classes = "icon icon-" + this.props.delimiterIcon;
    return (React.createElement("span", {className: classes}));
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.BreadcrumbItem;

PG.Components.Breadcrumb = React.createClass({displayName: "Breadcrumb",
  propTypes: {
    items: React.PropTypes.array,
    clickHandler: React.PropTypes.func,
    delimiterIcon: React.PropTypes.string,
    header: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      items: []
    };
  },

  render: function render() {
    var classes, items;

    classes = React.addons.classSet({
      "breadcrumbs" : true,
      "inline" : !this.props.header
    });

    items = this.props.items.map(function(item, index) {
      return (
        React.createElement(PG.Components.BreadcrumbItem, {
          key: index, 
          url: item.url, 
          text: item.text, 
          disabled: index === this.props.items.length - 1, 
          clickHandler: this.props.clickHandler, 
          icon: item.icon, 
          delimiterIcon: this.props.delimiterIcon}
        )
      );
    }.bind(this));

    return (
      React.createElement("ul", {className: classes}, items)
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.Breadcrumb;

PG.Components.Dropdown = React.createClass({displayName: "Dropdown",
  propTypes:  {
    items:          React.PropTypes.array,
    size:           React.PropTypes.string,
    role:           React.PropTypes.string,
    text:           React.PropTypes.string,
    disabled:       React.PropTypes.bool,
    selectHandler:  React.PropTypes.func,
    updateText:     React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      items: [],
      size: "medium",
      role: "primary",
      text: "Menu Item"
    };
  },

  getInitialState: function getInitialState() {
    return {
      open: false,
      text: this.props.text
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.text)
      this.setState({ text: nextProps.text });
  },

  handleButtonClick: function handleButtonClik() {
    this.setState({
      open: !this.state.open
    });
  },

  handleOptionSelection: function handleOptionSelection(el) {
    var nextState = { open: false },
      selectedOption = {
        value: el.target.value,
        text: el.target.getAttribute("data-text")
      };

    if (this.props.updateText)
      nextState.text = selectedOption.text;

    this.setState(nextState);

    if(this.props.selectHandler)
      this.props.selectHandler(selectedOption);
  },

  render: function render() {
    return (
      React.createElement("div", {className: "dropdown"}, 
        React.createElement(PG.Components.Button, {
          size: this.props.size, 
          role: this.props.role, 
          text: this.state.text, 
          showChevron: true, 
          disabled: this.props.disabled, 
          clickHandler: this.handleButtonClick}
        ), 
        React.createElement(PG.Components.DropdownMenu, {
          items: this.props.items, 
          open: this.state.open, 
          selectHandler: this.handleOptionSelection}
        )
      )
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.Dropdown;

PG.Components.DropdownMenuItem = React.createClass({displayName: "DropdownMenuItem",
  propTypes:  {
    type:            React.PropTypes.string,
    value:           React.PropTypes.string,
    text:            React.PropTypes.string,
    selectHandler:   React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      type: "item",
      text: "Menu Item"
    };
  },

  handleClick: function handleClick(el) {
    if (this.props.selectHandler)
      this.props.selectHandler(el);
  },

  render: function() {
    var classes;

    classes = React.addons.classSet({
      "item"    : this.props.type === "item",
      "title"   : this.props.type === "title",
      "divider" : this.props.type === "divider"
    });

    return (
      React.createElement("li", {className: classes}, 
        this.getItem()
      )
    );
  },

  getItem: function getItem() {
    if (this.props.type === "divider") return;

    if (this.props.type === "title") {
      return React.createElement("span", null, this.props.text);
    } else {
      return (
        React.createElement("label", {forHTML: this.props.value}, 

          React.createElement("input", {type: "radio", 
            onClick: this.handleClick, 
            name: this.props.value, 
            value: this.props.value, 
            "data-text": this.props.text}), 
          this.props.text

        )
      );
    }
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.DropdownMenuItem;

PG.Components.DropdownMenu = React.createClass({displayName: "DropdownMenu",
  propTypes:  {
    items:          React.PropTypes.array,
    open:           React.PropTypes.bool,
    transparent:    React.PropTypes.bool,
    textCentered:   React.PropTypes.bool,
    bold:           React.PropTypes.bool,
    selectHandler:  React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      items: [],
      open: false,
      transparent: false,
      textCentered: false,
      updateText: false
    };
  },

  render: function render() {
    var items, classes;

    classes = React.addons.classSet({
      "dropdown-menu" : true,
      "open"          : this.props.open,
      "transparent"   : this.props.transparent,
      "text-centered" : this.props.textCentered,
      "bold"          : this.props.bold
    });

    items = this.props.items.map(function(item, index){
      return (
        React.createElement(PG.Components.DropdownMenuItem, {
          key: index, 
          value: item.value, 
          text: item.text, 
          type: item.type, 
          selectHandler: this.props.selectHandler})
      );
    }.bind(this));

    return (
      React.createElement("ul", {className: classes}, items)
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.DropdownMenu;

PG.Components.ButtonGroup = React.createClass({displayName: "ButtonGroup",
  propTypes:  {
    size:           React.PropTypes.string,
    role:           React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      size: "medium",
      role: "primary"
    };
  },

  render: function render() {
    return (
      React.createElement("div", {className: "button-group"}, 
      this.getButtons()
      )
    );
  },

  getButtons: function getButtons() {
    if (!this.props.children) return;

    return React.Children.map(this.props.children, function (child) {
      if (child.type === PG.Components.Button.type) {
        return React.addons.cloneWithProps(child, {
          role: this.props.role,
          size: this.props.size
        });
      }
    }.bind(this));
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.ButtonGroup;

PG.Components.Button = React.createClass({displayName: "Button",
  allowedSizes: [ "x-small", "small", "medium", "large"],
  allowedRoles: [ "primary", "secondary", "additive", "destructive" ],

  propTypes:  {
    size:           React.PropTypes.string,
    role:           React.PropTypes.string,
    text:           React.PropTypes.string,
    disabled:       React.PropTypes.bool,
    fullWidth:      React.PropTypes.bool,
    showChevron:    React.PropTypes.bool,
    clickHandler:   React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      size: "medium",
      role: "primary",
      text: "Button",
      type: "button"
    };
  },

  handleClick: function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.clickHandler && !this.props.disabled)
      this.props.clickHandler(e);
  },

  render: function render() {
    var classSet = this.getClassSet(),
      classes = React.addons.classSet(classSet);

    return (
      React.createElement("button", {type: this.props.type, disabled: this.props.disabled, className: classes, onClick: this.handleClick}, 
        this.props.text, 
        this.getChevron(), 
        React.createElement("span", {className: "button-overlay"})
      )
    );
  },

  getClassSet: function getClassSet() {
    var classSet = {
      "button" : true,
      "full-width" : this.props.fullWidth,
      "medium" : this.allowedSizes.indexOf(this.props.size) === -1,
      "primary" : this.allowedRoles.indexOf(this.props.role) === -1
    };

    classSet[this.props.size] = this.allowedSizes.indexOf(this.props.size) > -1;
    classSet[this.props.role] = this.allowedRoles.indexOf(this.props.role) > -1;

    return classSet;
  },

  getChevron: function getChevron() {
    if (!this.props.showChevron) return;

    return (
      React.createElement("span", {className: "chevron-down"})
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.Button;

PG.Components.Label = React.createClass({displayName: "Label",
  allowedSizes: [ "small", "large"],
  allowedRoles: [ "primary", "secondary", "additive", "destructive", "grey", "orange", "purple"],

  propTypes:  {
    size:           React.PropTypes.string,
    role:           React.PropTypes.string,
    text:           React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      size: "large",
      role: "primary",
      text: "Label"
    };
  },

  render: function render() {
    var classSet = this.getClassSet(),
        classes = React.addons.classSet(classSet);

    return (
      React.createElement("span", {className: classes}, this.props.text)
    );
  },

  getClassSet: function getClassSet() {
    var classSet = {
      "label"   : true,
      "primary" : this.allowedRoles.indexOf(this.props.role) === -1,
      "large"   : this.allowedSizes.indexOf(this.props.size) === -1
    };

    classSet[this.props.size] = this.allowedSizes.indexOf(this.props.size) > -1;
    classSet[this.props.role] = this.allowedRoles.indexOf(this.props.role) > -1;

    return classSet;
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.Label;
PG.Components.FormField = React.createClass({displayName: "FormField",
  propTypes: {
    label: React.PropTypes.string,
    anchorText: React.PropTypes.string,
    anchorHref: React.PropTypes.string,
    errorMessage: React.PropTypes.string,
    inlineLabel: React.PropTypes.bool
  },

  getInitialState: function getInitialState() {
    return {
      focused: false
    };
  },

  render: function render() {
    var fieldClasses = React.addons.classSet({
        "form-field": true,
        "inline-label": this.props.inlineLabel,
        "error": this.props.errorMessage && !this.state.focused
      }),
      labelClasses = React.addons.classSet({
        "success": this.filledIn() && !this.props.errorMessage,
        "error": !!this.props.errorMessage
      });

    return (
      React.createElement("div", {className: fieldClasses}, 
        React.createElement("label", {className: labelClasses}, this.props.label), 
        this.getInputFields(), 
        this.renderAnchor(), 
        this.renderErrorMsg()
      )
    );
  },

  getInputFields: function getInputFields() {
    if (!this.props.children) return;

    var inline = this.props.children.length > 1;

    return React.Children.map(this.props.children, function (child) {
      if (child.type === PG.Components.InputField.type) {
        return React.addons.cloneWithProps(child, {
          inline: inline,
          focusHandler: this.handleInputFocus.bind(this, child),
          blurHandler: this.handleInputBlur.bind(this, child)
        });
      }
    }.bind(this));
  },

  renderAnchor: function renderAnchor() {
    if (!this.props.anchorText) return;

    return (
      React.createElement("a", {href: this.props.anchorHref, className: "form-field-link"}, 
      this.props.anchorText
      )
    );
  },

  renderErrorMsg: function renderErrorMsg() {
    if (!this.state.focused && this.props.errorMessage) {
      return (
        React.createElement("span", {className: "field-error-message"}, this.props.errorMessage)
      );
    }
  },

  handleInputFocus: function handleInputFocus(input) {
    this.setState({ focused: true });
    if (input.props.focusHandler)
      input.props.focusHandler();
  },

  handleInputBlur: function handleInputBlur(input) {
    this.setState({ focused: false });
    if (input.props.blurHandler)
      input.props.blurHandler();
  },

  filledIn: function filledIn() {
    var hasValue = true;
    React.Children.forEach(this.props.children, function(child) {
      if (!child.props.value) hasValue = false;
    });
    return hasValue;
  }
});

if (typeof module !== "undefined") module.exports = PG.Components.FormField;
PG.Components.InputField = React.createClass({displayName: "InputField",
  propTypes: {
    type: React.PropTypes.string,
    placeholder: React.PropTypes.string,
    value: React.PropTypes.string,
    inline: React.PropTypes.bool,
    error: React.PropTypes.bool,
    success: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    changeHandler: React.PropTypes.func,
    focusHandler: React.PropTypes.func,
    blurHandler: React.PropTypes.func,
    maxLength: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      maxLength: 2000
    };
  },

  getInitialState: function getInitialState() {
    return {
      focused: false
    };
  },

  render: function render() {
    var classes = React.addons.classSet({
      "inline": this.props.inline,
      "error": !this.state.focused && this.props.error,
      "success": !this.state.focused && this.props.success
    });

    return (
      React.createElement("input", {type: this.props.type, 
        placeholder: this.props.placeholder, 
        value: this.props.value, 
        className: classes, 
        onChange: this.props.changeHandler, 
        onFocus: this.handleFocus, 
        onBlur: this.handleBlur, 
        maxLength: this.props.maxLength, 
        disabled: this.props.disabled}
      )
    );
  },

  handleFocus: function handleFocus() {
    this.setState({focused: true});

    if(this.props.focusHandler)
      this.props.focusHandler();
  },

  handleBlur: function handleBlur() {
    this.setState({focused: false});

    if(this.props.blurHandler)
      this.props.blurHandler();
  }
});

if (typeof module !== "undefined") module.exports = PG.Components.InputField;
PG.Components.NavBar = React.createClass({displayName: "NavBar",

  render: function() {
    return (
      React.createElement("header", {className: "navigation-bar"}, 
        this.getLeftChild(), 
        this.getRightChild()
      )
    );
  },

  getLeftChild: function getLeftChild() {
    if (!this.props.children || !this.props.children[0]) return;

    return (
      React.createElement("div", {style: {float:"left"}}, 
          this.props.children[0]
      )
    );
  },

  getRightChild: function getRightChild() {
    if (!this.props.children || !this.props.children[1]) return;

    return (
      React.createElement("div", {style: {float:"right"}}, 
          this.props.children[1]
      )
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.NavBar;
PG.Components.NavigationItem = React.createClass({displayName: "NavigationItem",
  propTypes: {
    text: React.PropTypes.string,
    warning: React.PropTypes.bool,
    count: React.PropTypes.number,
    icon: React.PropTypes.string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      text: "Navigation Item"
    };
  },

  handleClick: function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.clickHandler) this.props.clickHandler(this);
  },

  render: function render() {
    return (
      React.createElement("li", null, 
        React.createElement("a", {href: this.props.url, onClick: this.handleClick}, 
          this.getIcon(), 
          React.createElement("span", {className: "label"}, this.props.text), 
          this.getCount()
        )
      )
    );
  },

  getIcon: function getIcon() {
    if (!this.props.icon) return;

    var classes = "icon-" + this.props.icon;
    return (
      React.createElement("span", {className: classes})
    );
  },

  getCount: function getCount() {
    if (!this.props.count) return;

    var classes = React.addons.classSet({
      "badge": true,
      "warning": this.props.warning
    });

    return (
      React.createElement("span", {className: "badge-wrapper"}, 
        React.createElement("span", {className: classes}, this.props.count)
      )
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.NavigationItem;
PG.Components.Navigation = React.createClass({displayName: "Navigation",
  propTypes: {
    items: React.PropTypes.array
  },

  getDefaultProps: function getDefaultProps() {
    return {
      items: []
    };
  },

  render: function render() {
    this.props.items = this.props.items || [];

    var items = this.props.items.map(function(item) {
      return (
        React.createElement(PG.Components.NavigationItem, {
          text: item.text, 
          count: item.count, 
          warning: item.warning})
      );
    });
    return (React.createElement("ul", {className: "menu"}, items));
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.Navigation;
PG.Components.PaginatorItem = React.createClass({displayName: "PaginatorItem",
  propTypes:  {
    pageIndex:      React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    type:           React.PropTypes.string,
    text:           React.PropTypes.string,
    disabled:       React.PropTypes.bool,
    clickHandler:   React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      type: "page"
    };
  },

  handleClick: function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.clickHandler && !this.props.disabled)
      this.props.clickHandler(this.props.pageIndex);
  },

  render: function render() {
    var classes = React.addons.classSet({
      "page"    : this.props.type === "page",
      "prev"    : this.props.type === "prev",
      "next"    : this.props.type === "next",
      "current"  : this.props.current
    });

    return (
      React.createElement("li", {className: classes, onClick: this.handleClick, disabled: this.props.disabled}, 
        React.createElement("a", {href: "#"}, this.props.text)
      )
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.PaginatorItem;

PG.Components.Paginator = React.createClass({displayName: "Paginator",
  propTypes:  {
    currentPageIndex:   React.PropTypes.number,
    numberOfPages:      React.PropTypes.number,
    prevText:           React.PropTypes.string,
    nextText:           React.PropTypes.string,
    clickHandler:       React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      currentPageIndex: 0,
      prevText: "Previous",
      nextText: "pNext`"
    };
  },

  getInitialState: function getInitialState() {
    return {
      currentPageIndex: this.props.currentPageIndex
    };
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (nextProps.currentPageIndex)
      this.setState({ currentPageIndex: nextProps.currentPageIndex });
  },

  handleClick: function handleClick(index) {
    var newIndex = this.getNewIndex(index);

    this.setState({
      currentPageIndex: newIndex
    });

    if (this.props.clickHandler)
      this.props.clickHandler(index);
  },

  getNewIndex: function getNewIndex(index) {
    if (index === "-")
      return this.state.currentPageIndex - 1;
    else if (index === "+")
      return this.state.currentPageIndex + 1;
    else
      return parseInt(index, 10);
  },

  render: function render() {
    var items = [], classes;

    classes = React.addons.classSet({
      "pagination"  : true,
      "pills"       : this.props.type === "prev-next"
    });

    items.push(
      React.createElement(PG.Components.PaginatorItem, {
        key: 0, 
        type: "prev", 
        pageIndex: "-", 
        text: this.props.prevText, 
        disabled: this.state.currentPageIndex === 0, 
        clickHandler: this.handleClick}
      )
    );

    if (this.props.type !== "prev-next") {
      for (var i = 0; i < this.props.numberOfPages; i++) {
        items.push(
          React.createElement(PG.Components.PaginatorItem, {
            key: i+1, 
            type: "page", 
            pageIndex: i, 
            text: (i+1).toString(), 
            current: this.state.currentPageIndex === i, 
            clickHandler: this.handleClick}
          )
        );
      }
    }

    items.push(
      React.createElement(PG.Components.PaginatorItem, {
        key: this.props.numberOfPages+1, 
        type: "next", 
        pageIndex: "+", 
        text: this.props.nextText, 
        disabled: this.state.currentPageIndex === this.props.numberOfPages - 1, 
        clickHandler: this.handleClick}
      )
    );

    return (
      React.createElement("ul", {className: classes}, 
      items
      )
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.Paginator;

PG.Components.TabItem = React.createClass({displayName: "TabItem",
  propTypes: {
    text: React.PropTypes.string,
    index: React.PropTypes.number,
    active: React.PropTypes.bool,
    badge: React.PropTypes.string,
    clickHandler: React.PropTypes.func
  },

  getDefaultProps: function getDefaultProps() {
    return {
      text: "Tab Item"
    };
  },

  handleClick: function(e) {
    e.preventDefault();
    e.stopPropagation();

    if (this.props.clickHandler)
      this.props.clickHandler(this.props.index);
  },

  render: function render() {
    var classes = React.addons.classSet({
      "active" : this.props.active
    });

    return (
      React.createElement("li", {className: classes}, 
        React.createElement("a", {href: "#", onClick: this.handleClick}, this.props.text, 
        this.getBadge()
        )
      )
    );
  },

  getBadge: function getBadge() {
    if (!this.props.badge) return;

    return (
      React.createElement("span", {className: "badge"}, this.props.badge)
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.TabItem;

PG.Components.Tabs = React.createClass({displayName: "Tabs",
  propTypes: {
    items: React.PropTypes.array,
    activeIndex: React.PropTypes.number,
    pills: React.PropTypes.bool
  },

  getDefaultProps: function getDefaultProps() {
    return {
      items: [],
      activeIndex: 0
    };
  },

  getInitialState: function() {
    return {
      activeIndex: this.props.activeIndex
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.activeIndex)
      this.setState({
        activeIndex: nextProps.activeIndex
      });
  },

  handleClick: function(index) {
    if (this.props.clickHandler)
      this.props.clickHandler(index);

    this.setState({
      activeIndex: index
    });
  },

  render: function() {
    var classes = React.addons.classSet({
      "tabs" : true,
      "pills" : this.props.pills
    });

    return (
      React.createElement("ul", {className: classes}, 
      this.props.items.map(function(item, index){
          return (
            React.createElement(PG.Components.TabItem, {
              key: index, 
              text: item.text, 
              index: index, 
              active: this.state.activeIndex === index, 
              badge: item.badge, 
              clickHandler: this.handleClick})
          )}.bind(this)
      ), 
        React.createElement("li", {tabIndex: "-1"})
      )
    );
  }
});

if(typeof module !== "undefined") module.exports = PG.Components.Tabs;



//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJyZWFkY3J1bWIvYnJlYWRjcnVtYi1pdGVtLmpzeCIsImJyZWFkY3J1bWIvYnJlYWRjcnVtYi5qc3giLCJkcm9wZG93bi9kcm9wZG93bi5qc3giLCJkcm9wZG93bi9tZW51LWl0ZW0uanN4IiwiZHJvcGRvd24vbWVudS5qc3giLCJidXR0b24vYnV0dG9uLWdyb3VwLmpzeCIsImJ1dHRvbi9idXR0b24uanN4IiwibGFiZWwvbGFiZWwuanN4IiwiZm9ybS9mb3JtLWZpZWxkLmpzeCIsImZvcm0vaW5wdXQtZmllbGQuanN4IiwibmF2YmFyL25hdkJhci5qc3giLCJuYXZwYW5lbC9uYXZpZ2F0aW9uLWl0ZW0uanN4IiwibmF2cGFuZWwvbmF2aWdhdGlvbi5qc3giLCJwYWdpbmF0b3IvcGFnaW5hdG9yLWl0ZW0uanN4IiwicGFnaW5hdG9yL3BhZ2luYXRvci5qc3giLCJ0YWJzL3RhYi1pdGVtLmpzeCIsInRhYnMvdGFicy5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsa0RBQWtELDhCQUFBO0VBQ2hELFNBQVMsRUFBRTtJQUNULElBQUksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU07SUFDNUIsR0FBRyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtJQUMzQixRQUFRLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJO0lBQzlCLFlBQVksRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7SUFDbEMsYUFBYSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTTtBQUN6QyxHQUFHOztFQUVELGVBQWUsRUFBRSxTQUFTLGVBQWUsR0FBRztJQUMxQyxPQUFPO01BQ0wsSUFBSSxFQUFFLGlCQUFpQjtNQUN2QixHQUFHLEVBQUUsR0FBRztLQUNULENBQUM7QUFDTixHQUFHOztFQUVELFdBQVcsRUFBRSxTQUFTLFdBQVcsQ0FBQyxDQUFDLEVBQUU7SUFDbkMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3ZCLElBQUksQ0FBQyxD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LEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFFLE9BQVMsQ0FBQSxFQUFBO01BQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLElBQUksRUFBRSxLQUFLLENBQUM7VUFDdkM7WUFDRSxvQkFBQyxxQkFBcUIsRUFBQSxDQUFBO2NBQ3BCLEdBQUEsRUFBRyxDQUFFLEtBQUssRUFBQztjQUNYLElBQUEsRUFBSSxDQUFFLElBQUksQ0FBQyxJQUFJLEVBQUM7Y0FDaEIsS0FBQSxFQUFLLENBQUUsS0FBSyxFQUFDO2NBQ2IsTUFBQSxFQUFNLENBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEtBQUssS0FBSyxFQUFDO2NBQ3pDLEtBQUEsRUFBSyxDQUFFLElBQUksQ0FBQyxLQUFLLEVBQUM7Y0FDbEIsWUFBQSxFQUFZLENBQUUsSUFBSSxDQUFDLFdBQVksQ0FBRSxDQUFBO1dBQ3BDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO09BQ2hCLEVBQUM7UUFDQSxvQkFBQSxJQUFHLEVBQUEsQ0FBQSxDQUFDLFFBQUEsRUFBUSxDQUFDLElBQUssQ0FBSyxDQUFBO01BQ3BCLENBQUE7TUFDTDtHQUNIO0FBQ0gsQ0FBQyxDQUFDLENBQUM7O0FBRUgsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLEVBQUUsTUFBTSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztBQUN0RSIsImZpbGUiOiJwZy1hc3NldHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJQRy5Db21wb25lbnRzLkJyZWFkY3J1bWJJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICB0ZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHVybDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkaXNhYmxlZDogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgY2xpY2tIYW5kbGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuYyxcbiAgICBkZWxpbWl0ZXJJY29uOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQ6IFwiQnJlYWRjcnVtYiBJdGVtXCIsXG4gICAgICB1cmw6IFwiI1wiXG4gICAgfTtcbiAgfSxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xpY2tIYW5kbGVyICYmICF0aGlzLnByb3BzLmRpc2FibGVkKVxuICAgICAgdGhpcy5wcm9wcy5jbGlja0hhbmRsZXIodGhpcyk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxsaT5cbiAgICAgICAgPGEgaHJlZj17dGhpcy5wcm9wcy51cmx9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9IGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfT5cbiAgICAgICAgICB7dGhpcy5nZXRJY29uKCl9XG4gICAgICAgICAge3RoaXMucHJvcHMudGV4dH1cbiAgICAgICAgICB7dGhpcy5nZXREZWxpbWl0ZXIoKX1cbiAgICAgICAgPC9hPlxuICAgICAgPC9saT5cbiAgICApO1xuICB9LFxuXG4gIGdldEljb246IGZ1bmN0aW9uIGdldEljb24oKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmljb24pIHJldHVybjtcblxuICAgIHZhciBjbGFzc2VzID0gXCJpY29uIGljb24tXCIgKyB0aGlzLnByb3BzLmljb247XG4gICAgcmV0dXJuICg8c3BhbiBjbGFzc05hbWU9e2NsYXNzZXN9Pjwvc3Bhbj4pO1xuICB9LFxuXG4gIGdldERlbGltaXRlcjogZnVuY3Rpb24gZ2V0RGVsaW1pdGVyKCkge1xuICAgIGlmICh0aGlzLnByb3BzLmRpc2FibGVkIHx8ICF0aGlzLnByb3BzLmRlbGltaXRlckljb24pIHJldHVybjtcblxuICAgIHZhciBjbGFzc2VzID0gXCJpY29uIGljb24tXCIgKyB0aGlzLnByb3BzLmRlbGltaXRlckljb247XG4gICAgcmV0dXJuICg8c3BhbiBjbGFzc05hbWU9e2NsYXNzZXN9Pjwvc3Bhbj4pO1xuICB9XG59KTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBQRy5Db21wb25lbnRzLkJyZWFkY3J1bWJJdGVtO1xuIiwiUEcuQ29tcG9uZW50cy5CcmVhZGNydW1iID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICBpdGVtczogUmVhY3QuUHJvcFR5cGVzLmFycmF5LFxuICAgIGNsaWNrSGFuZGxlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgZGVsaW1pdGVySWNvbjogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBoZWFkZXI6IFJlYWN0LlByb3BUeXBlcy5ib29sXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGl0ZW1zOiBbXVxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGNsYXNzZXMsIGl0ZW1zO1xuXG4gICAgY2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG4gICAgICBcImJyZWFkY3J1bWJzXCIgOiB0cnVlLFxuICAgICAgXCJpbmxpbmVcIiA6ICF0aGlzLnByb3BzLmhlYWRlclxuICAgIH0pO1xuXG4gICAgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zLm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPFBHLkNvbXBvbmVudHMuQnJlYWRjcnVtYkl0ZW1cbiAgICAgICAgICBrZXk9e2luZGV4fVxuICAgICAgICAgIHVybD17aXRlbS51cmx9XG4gICAgICAgICAgdGV4dD17aXRlbS50ZXh0fVxuICAgICAgICAgIGRpc2FibGVkPXtpbmRleCA9PT0gdGhpcy5wcm9wcy5pdGVtcy5sZW5ndGggLSAxfVxuICAgICAgICAgIGNsaWNrSGFuZGxlcj17dGhpcy5wcm9wcy5jbGlja0hhbmRsZXJ9XG4gICAgICAgICAgaWNvbj17aXRlbS5pY29ufVxuICAgICAgICAgIGRlbGltaXRlckljb249e3RoaXMucHJvcHMuZGVsaW1pdGVySWNvbn1cbiAgICAgICAgLz5cbiAgICAgICk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8dWwgY2xhc3NOYW1lPXtjbGFzc2VzfT57aXRlbXN9PC91bD5cbiAgICApO1xuICB9XG59KTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBQRy5Db21wb25lbnRzLkJyZWFkY3J1bWI7XG4iLCJQRy5Db21wb25lbnRzLkRyb3Bkb3duID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6ICB7XG4gICAgaXRlbXM6ICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgICBzaXplOiAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICByb2xlOiAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB0ZXh0OiAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBkaXNhYmxlZDogICAgICAgUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgc2VsZWN0SGFuZGxlcjogIFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIHVwZGF0ZVRleHQ6ICAgICBSZWFjdC5Qcm9wVHlwZXMuYm9vbFxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogW10sXG4gICAgICBzaXplOiBcIm1lZGl1bVwiLFxuICAgICAgcm9sZTogXCJwcmltYXJ5XCIsXG4gICAgICB0ZXh0OiBcIk1lbnUgSXRlbVwiXG4gICAgfTtcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICB0ZXh0OiB0aGlzLnByb3BzLnRleHRcbiAgICB9O1xuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMobmV4dFByb3BzKSB7XG4gICAgaWYgKG5leHRQcm9wcy50ZXh0KVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7IHRleHQ6IG5leHRQcm9wcy50ZXh0IH0pO1xuICB9LFxuXG4gIGhhbmRsZUJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBoYW5kbGVCdXR0b25DbGlrKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgb3BlbjogIXRoaXMuc3RhdGUub3BlblxuICAgIH0pO1xuICB9LFxuXG4gIGhhbmRsZU9wdGlvblNlbGVjdGlvbjogZnVuY3Rpb24gaGFuZGxlT3B0aW9uU2VsZWN0aW9uKGVsKSB7XG4gICAgdmFyIG5leHRTdGF0ZSA9IHsgb3BlbjogZmFsc2UgfSxcbiAgICAgIHNlbGVjdGVkT3B0aW9uID0ge1xuICAgICAgICB2YWx1ZTogZWwudGFyZ2V0LnZhbHVlLFxuICAgICAgICB0ZXh0OiBlbC50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS10ZXh0XCIpXG4gICAgICB9O1xuXG4gICAgaWYgKHRoaXMucHJvcHMudXBkYXRlVGV4dClcbiAgICAgIG5leHRTdGF0ZS50ZXh0ID0gc2VsZWN0ZWRPcHRpb24udGV4dDtcblxuICAgIHRoaXMuc2V0U3RhdGUobmV4dFN0YXRlKTtcblxuICAgIGlmKHRoaXMucHJvcHMuc2VsZWN0SGFuZGxlcilcbiAgICAgIHRoaXMucHJvcHMuc2VsZWN0SGFuZGxlcihzZWxlY3RlZE9wdGlvbik7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZHJvcGRvd25cIj5cbiAgICAgICAgPFBHLkNvbXBvbmVudHMuQnV0dG9uXG4gICAgICAgICAgc2l6ZT17dGhpcy5wcm9wcy5zaXplfVxuICAgICAgICAgIHJvbGU9e3RoaXMucHJvcHMucm9sZX1cbiAgICAgICAgICB0ZXh0PXt0aGlzLnN0YXRlLnRleHR9XG4gICAgICAgICAgc2hvd0NoZXZyb249e3RydWV9XG4gICAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG4gICAgICAgICAgY2xpY2tIYW5kbGVyPXt0aGlzLmhhbmRsZUJ1dHRvbkNsaWNrfVxuICAgICAgICAvPlxuICAgICAgICA8UEcuQ29tcG9uZW50cy5Ecm9wZG93bk1lbnVcbiAgICAgICAgICBpdGVtcz17dGhpcy5wcm9wcy5pdGVtc31cbiAgICAgICAgICBvcGVuPXt0aGlzLnN0YXRlLm9wZW59XG4gICAgICAgICAgc2VsZWN0SGFuZGxlcj17dGhpcy5oYW5kbGVPcHRpb25TZWxlY3Rpb259XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG59KTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBQRy5Db21wb25lbnRzLkRyb3Bkb3duO1xuIiwiUEcuQ29tcG9uZW50cy5Ecm9wZG93bk1lbnVJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6ICB7XG4gICAgdHlwZTogICAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIHZhbHVlOiAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB0ZXh0OiAgICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2VsZWN0SGFuZGxlcjogICBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBcIml0ZW1cIixcbiAgICAgIHRleHQ6IFwiTWVudSBJdGVtXCJcbiAgICB9O1xuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhlbCkge1xuICAgIGlmICh0aGlzLnByb3BzLnNlbGVjdEhhbmRsZXIpXG4gICAgICB0aGlzLnByb3BzLnNlbGVjdEhhbmRsZXIoZWwpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNsYXNzZXM7XG5cbiAgICBjbGFzc2VzID0gUmVhY3QuYWRkb25zLmNsYXNzU2V0KHtcbiAgICAgIFwiaXRlbVwiICAgIDogdGhpcy5wcm9wcy50eXBlID09PSBcIml0ZW1cIixcbiAgICAgIFwidGl0bGVcIiAgIDogdGhpcy5wcm9wcy50eXBlID09PSBcInRpdGxlXCIsXG4gICAgICBcImRpdmlkZXJcIiA6IHRoaXMucHJvcHMudHlwZSA9PT0gXCJkaXZpZGVyXCJcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc2VzfT5cbiAgICAgICAge3RoaXMuZ2V0SXRlbSgpfVxuICAgICAgPC9saT5cbiAgICApO1xuICB9LFxuXG4gIGdldEl0ZW06IGZ1bmN0aW9uIGdldEl0ZW0oKSB7XG4gICAgaWYgKHRoaXMucHJvcHMudHlwZSA9PT0gXCJkaXZpZGVyXCIpIHJldHVybjtcblxuICAgIGlmICh0aGlzLnByb3BzLnR5cGUgPT09IFwidGl0bGVcIikge1xuICAgICAgcmV0dXJuIDxzcGFuPnt0aGlzLnByb3BzLnRleHR9PC9zcGFuPjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGxhYmVsIGZvckhUTUw9e3RoaXMucHJvcHMudmFsdWV9ID5cblxuICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIlxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgICAgICAgIG5hbWU9e3RoaXMucHJvcHMudmFsdWV9XG4gICAgICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZX1cbiAgICAgICAgICAgIGRhdGEtdGV4dD17dGhpcy5wcm9wcy50ZXh0fSAvPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnRleHR9XG5cbiAgICAgICAgPC9sYWJlbD5cbiAgICAgICk7XG4gICAgfVxuICB9XG59KTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBQRy5Db21wb25lbnRzLkRyb3Bkb3duTWVudUl0ZW07XG4iLCJQRy5Db21wb25lbnRzLkRyb3Bkb3duTWVudSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiAge1xuICAgIGl0ZW1zOiAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuYXJyYXksXG4gICAgb3BlbjogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIHRyYW5zcGFyZW50OiAgICBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICB0ZXh0Q2VudGVyZWQ6ICAgUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgYm9sZDogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIHNlbGVjdEhhbmRsZXI6ICBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBpdGVtczogW10sXG4gICAgICBvcGVuOiBmYWxzZSxcbiAgICAgIHRyYW5zcGFyZW50OiBmYWxzZSxcbiAgICAgIHRleHRDZW50ZXJlZDogZmFsc2UsXG4gICAgICB1cGRhdGVUZXh0OiBmYWxzZVxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGl0ZW1zLCBjbGFzc2VzO1xuXG4gICAgY2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG4gICAgICBcImRyb3Bkb3duLW1lbnVcIiA6IHRydWUsXG4gICAgICBcIm9wZW5cIiAgICAgICAgICA6IHRoaXMucHJvcHMub3BlbixcbiAgICAgIFwidHJhbnNwYXJlbnRcIiAgIDogdGhpcy5wcm9wcy50cmFuc3BhcmVudCxcbiAgICAgIFwidGV4dC1jZW50ZXJlZFwiIDogdGhpcy5wcm9wcy50ZXh0Q2VudGVyZWQsXG4gICAgICBcImJvbGRcIiAgICAgICAgICA6IHRoaXMucHJvcHMuYm9sZFxuICAgIH0pO1xuXG4gICAgaXRlbXMgPSB0aGlzLnByb3BzLml0ZW1zLm1hcChmdW5jdGlvbihpdGVtLCBpbmRleCl7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8UEcuQ29tcG9uZW50cy5Ecm9wZG93bk1lbnVJdGVtXG4gICAgICAgICAga2V5PXtpbmRleH1cbiAgICAgICAgICB2YWx1ZT17aXRlbS52YWx1ZX1cbiAgICAgICAgICB0ZXh0PXtpdGVtLnRleHR9XG4gICAgICAgICAgdHlwZT17aXRlbS50eXBlfVxuICAgICAgICAgIHNlbGVjdEhhbmRsZXI9e3RoaXMucHJvcHMuc2VsZWN0SGFuZGxlcn0gLz5cbiAgICAgICk7XG4gICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIHJldHVybiAoXG4gICAgICA8dWwgY2xhc3NOYW1lPXtjbGFzc2VzfT57aXRlbXN9PC91bD5cbiAgICApO1xuICB9XG59KTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBQRy5Db21wb25lbnRzLkRyb3Bkb3duTWVudTtcbiIsIlBHLkNvbXBvbmVudHMuQnV0dG9uR3JvdXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczogIHtcbiAgICBzaXplOiAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICByb2xlOiAgICAgICAgICAgUmVhY3QuUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzaXplOiBcIm1lZGl1bVwiLFxuICAgICAgcm9sZTogXCJwcmltYXJ5XCJcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ1dHRvbi1ncm91cFwiPlxuICAgICAge3RoaXMuZ2V0QnV0dG9ucygpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcblxuICBnZXRCdXR0b25zOiBmdW5jdGlvbiBnZXRCdXR0b25zKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5jaGlsZHJlbikgcmV0dXJuO1xuXG4gICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcCh0aGlzLnByb3BzLmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZC50eXBlID09PSBQRy5Db21wb25lbnRzLkJ1dHRvbi50eXBlKSB7XG4gICAgICAgIHJldHVybiBSZWFjdC5hZGRvbnMuY2xvbmVXaXRoUHJvcHMoY2hpbGQsIHtcbiAgICAgICAgICByb2xlOiB0aGlzLnByb3BzLnJvbGUsXG4gICAgICAgICAgc2l6ZTogdGhpcy5wcm9wcy5zaXplXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH1cbn0pO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKSBtb2R1bGUuZXhwb3J0cyA9IFBHLkNvbXBvbmVudHMuQnV0dG9uR3JvdXA7XG4iLCJQRy5Db21wb25lbnRzLkJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgYWxsb3dlZFNpemVzOiBbIFwieC1zbWFsbFwiLCBcInNtYWxsXCIsIFwibWVkaXVtXCIsIFwibGFyZ2VcIl0sXG4gIGFsbG93ZWRSb2xlczogWyBcInByaW1hcnlcIiwgXCJzZWNvbmRhcnlcIiwgXCJhZGRpdGl2ZVwiLCBcImRlc3RydWN0aXZlXCIgXSxcblxuICBwcm9wVHlwZXM6ICB7XG4gICAgc2l6ZTogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgcm9sZTogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGV4dDogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGlzYWJsZWQ6ICAgICAgIFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIGZ1bGxXaWR0aDogICAgICBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBzaG93Q2hldnJvbjogICAgUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgY2xpY2tIYW5kbGVyOiAgIFJlYWN0LlByb3BUeXBlcy5mdW5jXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNpemU6IFwibWVkaXVtXCIsXG4gICAgICByb2xlOiBcInByaW1hcnlcIixcbiAgICAgIHRleHQ6IFwiQnV0dG9uXCIsXG4gICAgICB0eXBlOiBcImJ1dHRvblwiXG4gICAgfTtcbiAgfSxcblxuICBoYW5kbGVDbGljazogZnVuY3Rpb24gaGFuZGxlQ2xpY2soZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgaWYgKHRoaXMucHJvcHMuY2xpY2tIYW5kbGVyICYmICF0aGlzLnByb3BzLmRpc2FibGVkKVxuICAgICAgdGhpcy5wcm9wcy5jbGlja0hhbmRsZXIoZSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGNsYXNzU2V0ID0gdGhpcy5nZXRDbGFzc1NldCgpLFxuICAgICAgY2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldChjbGFzc1NldCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGJ1dHRvbiB0eXBlPXt0aGlzLnByb3BzLnR5cGV9IGRpc2FibGVkPXt0aGlzLnByb3BzLmRpc2FibGVkfSBjbGFzc05hbWU9e2NsYXNzZXN9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlQ2xpY2t9PlxuICAgICAgICB7dGhpcy5wcm9wcy50ZXh0fVxuICAgICAgICB7dGhpcy5nZXRDaGV2cm9uKCl9XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJ1dHRvbi1vdmVybGF5XCI+PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgKTtcbiAgfSxcblxuICBnZXRDbGFzc1NldDogZnVuY3Rpb24gZ2V0Q2xhc3NTZXQoKSB7XG4gICAgdmFyIGNsYXNzU2V0ID0ge1xuICAgICAgXCJidXR0b25cIiA6IHRydWUsXG4gICAgICBcImZ1bGwtd2lkdGhcIiA6IHRoaXMucHJvcHMuZnVsbFdpZHRoLFxuICAgICAgXCJtZWRpdW1cIiA6IHRoaXMuYWxsb3dlZFNpemVzLmluZGV4T2YodGhpcy5wcm9wcy5zaXplKSA9PT0gLTEsXG4gICAgICBcInByaW1hcnlcIiA6IHRoaXMuYWxsb3dlZFJvbGVzLmluZGV4T2YodGhpcy5wcm9wcy5yb2xlKSA9PT0gLTFcbiAgICB9O1xuXG4gICAgY2xhc3NTZXRbdGhpcy5wcm9wcy5zaXplXSA9IHRoaXMuYWxsb3dlZFNpemVzLmluZGV4T2YodGhpcy5wcm9wcy5zaXplKSA+IC0xO1xuICAgIGNsYXNzU2V0W3RoaXMucHJvcHMucm9sZV0gPSB0aGlzLmFsbG93ZWRSb2xlcy5pbmRleE9mKHRoaXMucHJvcHMucm9sZSkgPiAtMTtcblxuICAgIHJldHVybiBjbGFzc1NldDtcbiAgfSxcblxuICBnZXRDaGV2cm9uOiBmdW5jdGlvbiBnZXRDaGV2cm9uKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5zaG93Q2hldnJvbikgcmV0dXJuO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImNoZXZyb24tZG93blwiPjwvc3Bhbj5cbiAgICApO1xuICB9XG59KTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBQRy5Db21wb25lbnRzLkJ1dHRvbjtcbiIsIlBHLkNvbXBvbmVudHMuTGFiZWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIGFsbG93ZWRTaXplczogWyBcInNtYWxsXCIsIFwibGFyZ2VcIl0sXG4gIGFsbG93ZWRSb2xlczogWyBcInByaW1hcnlcIiwgXCJzZWNvbmRhcnlcIiwgXCJhZGRpdGl2ZVwiLCBcImRlc3RydWN0aXZlXCIsIFwiZ3JleVwiLCBcIm9yYW5nZVwiLCBcInB1cnBsZVwiXSxcblxuICBwcm9wVHlwZXM6ICB7XG4gICAgc2l6ZTogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgcm9sZTogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGV4dDogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmdcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2l6ZTogXCJsYXJnZVwiLFxuICAgICAgcm9sZTogXCJwcmltYXJ5XCIsXG4gICAgICB0ZXh0OiBcIkxhYmVsXCJcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBjbGFzc1NldCA9IHRoaXMuZ2V0Q2xhc3NTZXQoKSxcbiAgICAgICAgY2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldChjbGFzc1NldCk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc2VzfT57dGhpcy5wcm9wcy50ZXh0fTwvc3Bhbj5cbiAgICApO1xuICB9LFxuXG4gIGdldENsYXNzU2V0OiBmdW5jdGlvbiBnZXRDbGFzc1NldCgpIHtcbiAgICB2YXIgY2xhc3NTZXQgPSB7XG4gICAgICBcImxhYmVsXCIgICA6IHRydWUsXG4gICAgICBcInByaW1hcnlcIiA6IHRoaXMuYWxsb3dlZFJvbGVzLmluZGV4T2YodGhpcy5wcm9wcy5yb2xlKSA9PT0gLTEsXG4gICAgICBcImxhcmdlXCIgICA6IHRoaXMuYWxsb3dlZFNpemVzLmluZGV4T2YodGhpcy5wcm9wcy5zaXplKSA9PT0gLTFcbiAgICB9O1xuXG4gICAgY2xhc3NTZXRbdGhpcy5wcm9wcy5zaXplXSA9IHRoaXMuYWxsb3dlZFNpemVzLmluZGV4T2YodGhpcy5wcm9wcy5zaXplKSA+IC0xO1xuICAgIGNsYXNzU2V0W3RoaXMucHJvcHMucm9sZV0gPSB0aGlzLmFsbG93ZWRSb2xlcy5pbmRleE9mKHRoaXMucHJvcHMucm9sZSkgPiAtMTtcblxuICAgIHJldHVybiBjbGFzc1NldDtcbiAgfVxufSk7XG5cbmlmKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIG1vZHVsZS5leHBvcnRzID0gUEcuQ29tcG9uZW50cy5MYWJlbDsiLCJQRy5Db21wb25lbnRzLkZvcm1GaWVsZCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgbGFiZWw6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgYW5jaG9yVGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBhbmNob3JIcmVmOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGVycm9yTWVzc2FnZTogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICBpbmxpbmVMYWJlbDogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgfSxcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZm9jdXNlZDogZmFsc2VcbiAgICB9O1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBmaWVsZENsYXNzZXMgPSBSZWFjdC5hZGRvbnMuY2xhc3NTZXQoe1xuICAgICAgICBcImZvcm0tZmllbGRcIjogdHJ1ZSxcbiAgICAgICAgXCJpbmxpbmUtbGFiZWxcIjogdGhpcy5wcm9wcy5pbmxpbmVMYWJlbCxcbiAgICAgICAgXCJlcnJvclwiOiB0aGlzLnByb3BzLmVycm9yTWVzc2FnZSAmJiAhdGhpcy5zdGF0ZS5mb2N1c2VkXG4gICAgICB9KSxcbiAgICAgIGxhYmVsQ2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG4gICAgICAgIFwic3VjY2Vzc1wiOiB0aGlzLmZpbGxlZEluKCkgJiYgIXRoaXMucHJvcHMuZXJyb3JNZXNzYWdlLFxuICAgICAgICBcImVycm9yXCI6ICEhdGhpcy5wcm9wcy5lcnJvck1lc3NhZ2VcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtmaWVsZENsYXNzZXN9PlxuICAgICAgICA8bGFiZWwgY2xhc3NOYW1lPXtsYWJlbENsYXNzZXN9Pnt0aGlzLnByb3BzLmxhYmVsfTwvbGFiZWw+XG4gICAgICAgIHt0aGlzLmdldElucHV0RmllbGRzKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckFuY2hvcigpfVxuICAgICAgICB7dGhpcy5yZW5kZXJFcnJvck1zZygpfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfSxcblxuICBnZXRJbnB1dEZpZWxkczogZnVuY3Rpb24gZ2V0SW5wdXRGaWVsZHMoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNoaWxkcmVuKSByZXR1cm47XG5cbiAgICB2YXIgaW5saW5lID0gdGhpcy5wcm9wcy5jaGlsZHJlbi5sZW5ndGggPiAxO1xuXG4gICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcCh0aGlzLnByb3BzLmNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgIGlmIChjaGlsZC50eXBlID09PSBQRy5Db21wb25lbnRzLklucHV0RmllbGQudHlwZSkge1xuICAgICAgICByZXR1cm4gUmVhY3QuYWRkb25zLmNsb25lV2l0aFByb3BzKGNoaWxkLCB7XG4gICAgICAgICAgaW5saW5lOiBpbmxpbmUsXG4gICAgICAgICAgZm9jdXNIYW5kbGVyOiB0aGlzLmhhbmRsZUlucHV0Rm9jdXMuYmluZCh0aGlzLCBjaGlsZCksXG4gICAgICAgICAgYmx1ckhhbmRsZXI6IHRoaXMuaGFuZGxlSW5wdXRCbHVyLmJpbmQodGhpcywgY2hpbGQpXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgcmVuZGVyQW5jaG9yOiBmdW5jdGlvbiByZW5kZXJBbmNob3IoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmFuY2hvclRleHQpIHJldHVybjtcblxuICAgIHJldHVybiAoXG4gICAgICA8YSBocmVmPXt0aGlzLnByb3BzLmFuY2hvckhyZWZ9IGNsYXNzTmFtZT1cImZvcm0tZmllbGQtbGlua1wiPlxuICAgICAge3RoaXMucHJvcHMuYW5jaG9yVGV4dH1cbiAgICAgIDwvYT5cbiAgICApO1xuICB9LFxuXG4gIHJlbmRlckVycm9yTXNnOiBmdW5jdGlvbiByZW5kZXJFcnJvck1zZygpIHtcbiAgICBpZiAoIXRoaXMuc3RhdGUuZm9jdXNlZCAmJiB0aGlzLnByb3BzLmVycm9yTWVzc2FnZSkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZmllbGQtZXJyb3ItbWVzc2FnZVwiPnt0aGlzLnByb3BzLmVycm9yTWVzc2FnZX08L3NwYW4+XG4gICAgICApO1xuICAgIH1cbiAgfSxcblxuICBoYW5kbGVJbnB1dEZvY3VzOiBmdW5jdGlvbiBoYW5kbGVJbnB1dEZvY3VzKGlucHV0KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZvY3VzZWQ6IHRydWUgfSk7XG4gICAgaWYgKGlucHV0LnByb3BzLmZvY3VzSGFuZGxlcilcbiAgICAgIGlucHV0LnByb3BzLmZvY3VzSGFuZGxlcigpO1xuICB9LFxuXG4gIGhhbmRsZUlucHV0Qmx1cjogZnVuY3Rpb24gaGFuZGxlSW5wdXRCbHVyKGlucHV0KSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7IGZvY3VzZWQ6IGZhbHNlIH0pO1xuICAgIGlmIChpbnB1dC5wcm9wcy5ibHVySGFuZGxlcilcbiAgICAgIGlucHV0LnByb3BzLmJsdXJIYW5kbGVyKCk7XG4gIH0sXG5cbiAgZmlsbGVkSW46IGZ1bmN0aW9uIGZpbGxlZEluKCkge1xuICAgIHZhciBoYXNWYWx1ZSA9IHRydWU7XG4gICAgUmVhY3QuQ2hpbGRyZW4uZm9yRWFjaCh0aGlzLnByb3BzLmNoaWxkcmVuLCBmdW5jdGlvbihjaGlsZCkge1xuICAgICAgaWYgKCFjaGlsZC5wcm9wcy52YWx1ZSkgaGFzVmFsdWUgPSBmYWxzZTtcbiAgICB9KTtcbiAgICByZXR1cm4gaGFzVmFsdWU7XG4gIH1cbn0pO1xuXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBQRy5Db21wb25lbnRzLkZvcm1GaWVsZDsiLCJQRy5Db21wb25lbnRzLklucHV0RmllbGQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIHR5cGU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgcGxhY2Vob2xkZXI6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdmFsdWU6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgaW5saW5lOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBlcnJvcjogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgc3VjY2VzczogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgZGlzYWJsZWQ6IFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIGNoYW5nZUhhbmRsZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIGZvY3VzSGFuZGxlcjogUmVhY3QuUHJvcFR5cGVzLmZ1bmMsXG4gICAgYmx1ckhhbmRsZXI6IFJlYWN0LlByb3BUeXBlcy5mdW5jLFxuICAgIG1heExlbmd0aDogUmVhY3QuUHJvcFR5cGVzLm51bWJlclxuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICBtYXhMZW5ndGg6IDIwMDBcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24gZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBmb2N1c2VkOiBmYWxzZVxuICAgIH07XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdmFyIGNsYXNzZXMgPSBSZWFjdC5hZGRvbnMuY2xhc3NTZXQoe1xuICAgICAgXCJpbmxpbmVcIjogdGhpcy5wcm9wcy5pbmxpbmUsXG4gICAgICBcImVycm9yXCI6ICF0aGlzLnN0YXRlLmZvY3VzZWQgJiYgdGhpcy5wcm9wcy5lcnJvcixcbiAgICAgIFwic3VjY2Vzc1wiOiAhdGhpcy5zdGF0ZS5mb2N1c2VkICYmIHRoaXMucHJvcHMuc3VjY2Vzc1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxpbnB1dCB0eXBlPXt0aGlzLnByb3BzLnR5cGV9XG4gICAgICAgIHBsYWNlaG9sZGVyPXt0aGlzLnByb3BzLnBsYWNlaG9sZGVyfVxuICAgICAgICB2YWx1ZT17dGhpcy5wcm9wcy52YWx1ZX1cbiAgICAgICAgY2xhc3NOYW1lPXtjbGFzc2VzfVxuICAgICAgICBvbkNoYW5nZT17dGhpcy5wcm9wcy5jaGFuZ2VIYW5kbGVyfVxuICAgICAgICBvbkZvY3VzPXt0aGlzLmhhbmRsZUZvY3VzfVxuICAgICAgICBvbkJsdXI9e3RoaXMuaGFuZGxlQmx1cn1cbiAgICAgICAgbWF4TGVuZ3RoPXt0aGlzLnByb3BzLm1heExlbmd0aH1cbiAgICAgICAgZGlzYWJsZWQ9e3RoaXMucHJvcHMuZGlzYWJsZWR9XG4gICAgICAvPlxuICAgICk7XG4gIH0sXG5cbiAgaGFuZGxlRm9jdXM6IGZ1bmN0aW9uIGhhbmRsZUZvY3VzKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2ZvY3VzZWQ6IHRydWV9KTtcblxuICAgIGlmKHRoaXMucHJvcHMuZm9jdXNIYW5kbGVyKVxuICAgICAgdGhpcy5wcm9wcy5mb2N1c0hhbmRsZXIoKTtcbiAgfSxcblxuICBoYW5kbGVCbHVyOiBmdW5jdGlvbiBoYW5kbGVCbHVyKCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe2ZvY3VzZWQ6IGZhbHNlfSk7XG5cbiAgICBpZih0aGlzLnByb3BzLmJsdXJIYW5kbGVyKVxuICAgICAgdGhpcy5wcm9wcy5ibHVySGFuZGxlcigpO1xuICB9XG59KTtcblxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIG1vZHVsZS5leHBvcnRzID0gUEcuQ29tcG9uZW50cy5JbnB1dEZpZWxkOyIsIlBHLkNvbXBvbmVudHMuTmF2QmFyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwibmF2aWdhdGlvbi1iYXJcIj5cbiAgICAgICAge3RoaXMuZ2V0TGVmdENoaWxkKCl9XG4gICAgICAgIHt0aGlzLmdldFJpZ2h0Q2hpbGQoKX1cbiAgICAgIDwvaGVhZGVyPlxuICAgICk7XG4gIH0sXG5cbiAgZ2V0TGVmdENoaWxkOiBmdW5jdGlvbiBnZXRMZWZ0Q2hpbGQoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNoaWxkcmVuIHx8ICF0aGlzLnByb3BzLmNoaWxkcmVuWzBdKSByZXR1cm47XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e2Zsb2F0OlwibGVmdFwifX0+XG4gICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW5bMF19XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9LFxuXG4gIGdldFJpZ2h0Q2hpbGQ6IGZ1bmN0aW9uIGdldFJpZ2h0Q2hpbGQoKSB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNoaWxkcmVuIHx8ICF0aGlzLnByb3BzLmNoaWxkcmVuWzFdKSByZXR1cm47XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBzdHlsZT17e2Zsb2F0OlwicmlnaHRcIn19PlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVuWzFdfVxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxufSk7XG5cbmlmKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIG1vZHVsZS5leHBvcnRzID0gUEcuQ29tcG9uZW50cy5OYXZCYXI7IiwiUEcuQ29tcG9uZW50cy5OYXZpZ2F0aW9uSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgdGV4dDogUmVhY3QuUHJvcFR5cGVzLnN0cmluZyxcbiAgICB3YXJuaW5nOiBSZWFjdC5Qcm9wVHlwZXMuYm9vbCxcbiAgICBjb3VudDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBpY29uOiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nXG4gIH0sXG5cbiAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbiBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHRleHQ6IFwiTmF2aWdhdGlvbiBJdGVtXCJcbiAgICB9O1xuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbiBoYW5kbGVDbGljayhlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbGlja0hhbmRsZXIpIHRoaXMucHJvcHMuY2xpY2tIYW5kbGVyKHRoaXMpO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8bGk+XG4gICAgICAgIDxhIGhyZWY9e3RoaXMucHJvcHMudXJsfSBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT5cbiAgICAgICAgICB7dGhpcy5nZXRJY29uKCl9XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibGFiZWxcIj57dGhpcy5wcm9wcy50ZXh0fTwvc3Bhbj5cbiAgICAgICAgICB7dGhpcy5nZXRDb3VudCgpfVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH0sXG5cbiAgZ2V0SWNvbjogZnVuY3Rpb24gZ2V0SWNvbigpIHtcbiAgICBpZiAoIXRoaXMucHJvcHMuaWNvbikgcmV0dXJuO1xuXG4gICAgdmFyIGNsYXNzZXMgPSBcImljb24tXCIgKyB0aGlzLnByb3BzLmljb247XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT17Y2xhc3Nlc30+PC9zcGFuPlxuICAgICk7XG4gIH0sXG5cbiAgZ2V0Q291bnQ6IGZ1bmN0aW9uIGdldENvdW50KCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5jb3VudCkgcmV0dXJuO1xuXG4gICAgdmFyIGNsYXNzZXMgPSBSZWFjdC5hZGRvbnMuY2xhc3NTZXQoe1xuICAgICAgXCJiYWRnZVwiOiB0cnVlLFxuICAgICAgXCJ3YXJuaW5nXCI6IHRoaXMucHJvcHMud2FybmluZ1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlLXdyYXBwZXJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc2VzfT57dGhpcy5wcm9wcy5jb3VudH08L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgKTtcbiAgfVxufSk7XG5cbmlmKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIG1vZHVsZS5leHBvcnRzID0gUEcuQ29tcG9uZW50cy5OYXZpZ2F0aW9uSXRlbTsiLCJQRy5Db21wb25lbnRzLk5hdmlnYXRpb24gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gIHByb3BUeXBlczoge1xuICAgIGl0ZW1zOiBSZWFjdC5Qcm9wVHlwZXMuYXJyYXlcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IFtdXG4gICAgfTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB0aGlzLnByb3BzLml0ZW1zID0gdGhpcy5wcm9wcy5pdGVtcyB8fCBbXTtcblxuICAgIHZhciBpdGVtcyA9IHRoaXMucHJvcHMuaXRlbXMubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxQRy5Db21wb25lbnRzLk5hdmlnYXRpb25JdGVtXG4gICAgICAgICAgdGV4dD17aXRlbS50ZXh0fVxuICAgICAgICAgIGNvdW50PXtpdGVtLmNvdW50fVxuICAgICAgICAgIHdhcm5pbmc9e2l0ZW0ud2FybmluZ30vPlxuICAgICAgKTtcbiAgICB9KTtcbiAgICByZXR1cm4gKDx1bCBjbGFzc05hbWU9XCJtZW51XCI+e2l0ZW1zfTwvdWw+KTtcbiAgfVxufSk7XG5cbmlmKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIpIG1vZHVsZS5leHBvcnRzID0gUEcuQ29tcG9uZW50cy5OYXZpZ2F0aW9uOyIsIlBHLkNvbXBvbmVudHMuUGFnaW5hdG9ySXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiAge1xuICAgIHBhZ2VJbmRleDogICAgICBSZWFjdC5Qcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgICBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyXG4gICAgXSksXG4gICAgdHlwZTogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgdGV4dDogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgZGlzYWJsZWQ6ICAgICAgIFJlYWN0LlByb3BUeXBlcy5ib29sLFxuICAgIGNsaWNrSGFuZGxlcjogICBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiBcInBhZ2VcIlxuICAgIH07XG4gIH0sXG5cbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIGlmICh0aGlzLnByb3BzLmNsaWNrSGFuZGxlciAmJiAhdGhpcy5wcm9wcy5kaXNhYmxlZClcbiAgICAgIHRoaXMucHJvcHMuY2xpY2tIYW5kbGVyKHRoaXMucHJvcHMucGFnZUluZGV4KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG4gICAgICBcInBhZ2VcIiAgICA6IHRoaXMucHJvcHMudHlwZSA9PT0gXCJwYWdlXCIsXG4gICAgICBcInByZXZcIiAgICA6IHRoaXMucHJvcHMudHlwZSA9PT0gXCJwcmV2XCIsXG4gICAgICBcIm5leHRcIiAgICA6IHRoaXMucHJvcHMudHlwZSA9PT0gXCJuZXh0XCIsXG4gICAgICBcImN1cnJlbnRcIiAgOiB0aGlzLnByb3BzLmN1cnJlbnRcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc2VzfSBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfSBkaXNhYmxlZD17dGhpcy5wcm9wcy5kaXNhYmxlZH0+XG4gICAgICAgIDxhIGhyZWY9XCIjXCI+e3RoaXMucHJvcHMudGV4dH08L2E+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH1cbn0pO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKSBtb2R1bGUuZXhwb3J0cyA9IFBHLkNvbXBvbmVudHMuUGFnaW5hdG9ySXRlbTtcbiIsIlBHLkNvbXBvbmVudHMuUGFnaW5hdG9yID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6ICB7XG4gICAgY3VycmVudFBhZ2VJbmRleDogICBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIG51bWJlck9mUGFnZXM6ICAgICAgUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBwcmV2VGV4dDogICAgICAgICAgIFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgbmV4dFRleHQ6ICAgICAgICAgICBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGNsaWNrSGFuZGxlcjogICAgICAgUmVhY3QuUHJvcFR5cGVzLmZ1bmNcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgY3VycmVudFBhZ2VJbmRleDogMCxcbiAgICAgIHByZXZUZXh0OiBcIlByZXZpb3VzXCIsXG4gICAgICBuZXh0VGV4dDogXCJwTmV4dGBcIlxuICAgIH07XG4gIH0sXG5cbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiBnZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGN1cnJlbnRQYWdlSW5kZXg6IHRoaXMucHJvcHMuY3VycmVudFBhZ2VJbmRleFxuICAgIH07XG4gIH0sXG5cbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcyhuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLmN1cnJlbnRQYWdlSW5kZXgpXG4gICAgICB0aGlzLnNldFN0YXRlKHsgY3VycmVudFBhZ2VJbmRleDogbmV4dFByb3BzLmN1cnJlbnRQYWdlSW5kZXggfSk7XG4gIH0sXG5cbiAgaGFuZGxlQ2xpY2s6IGZ1bmN0aW9uIGhhbmRsZUNsaWNrKGluZGV4KSB7XG4gICAgdmFyIG5ld0luZGV4ID0gdGhpcy5nZXROZXdJbmRleChpbmRleCk7XG5cbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGN1cnJlbnRQYWdlSW5kZXg6IG5ld0luZGV4XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbGlja0hhbmRsZXIpXG4gICAgICB0aGlzLnByb3BzLmNsaWNrSGFuZGxlcihpbmRleCk7XG4gIH0sXG5cbiAgZ2V0TmV3SW5kZXg6IGZ1bmN0aW9uIGdldE5ld0luZGV4KGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID09PSBcIi1cIilcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlSW5kZXggLSAxO1xuICAgIGVsc2UgaWYgKGluZGV4ID09PSBcIitcIilcbiAgICAgIHJldHVybiB0aGlzLnN0YXRlLmN1cnJlbnRQYWdlSW5kZXggKyAxO1xuICAgIGVsc2VcbiAgICAgIHJldHVybiBwYXJzZUludChpbmRleCwgMTApO1xuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHZhciBpdGVtcyA9IFtdLCBjbGFzc2VzO1xuXG4gICAgY2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG4gICAgICBcInBhZ2luYXRpb25cIiAgOiB0cnVlLFxuICAgICAgXCJwaWxsc1wiICAgICAgIDogdGhpcy5wcm9wcy50eXBlID09PSBcInByZXYtbmV4dFwiXG4gICAgfSk7XG5cbiAgICBpdGVtcy5wdXNoKFxuICAgICAgPFBHLkNvbXBvbmVudHMuUGFnaW5hdG9ySXRlbVxuICAgICAgICBrZXk9ezB9XG4gICAgICAgIHR5cGU9XCJwcmV2XCJcbiAgICAgICAgcGFnZUluZGV4PVwiLVwiXG4gICAgICAgIHRleHQ9e3RoaXMucHJvcHMucHJldlRleHR9XG4gICAgICAgIGRpc2FibGVkPXt0aGlzLnN0YXRlLmN1cnJlbnRQYWdlSW5kZXggPT09IDB9XG4gICAgICAgIGNsaWNrSGFuZGxlcj17dGhpcy5oYW5kbGVDbGlja31cbiAgICAgIC8+XG4gICAgKTtcblxuICAgIGlmICh0aGlzLnByb3BzLnR5cGUgIT09IFwicHJldi1uZXh0XCIpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wcm9wcy5udW1iZXJPZlBhZ2VzOyBpKyspIHtcbiAgICAgICAgaXRlbXMucHVzaChcbiAgICAgICAgICA8UEcuQ29tcG9uZW50cy5QYWdpbmF0b3JJdGVtXG4gICAgICAgICAgICBrZXk9e2krMX1cbiAgICAgICAgICAgIHR5cGU9XCJwYWdlXCJcbiAgICAgICAgICAgIHBhZ2VJbmRleD17aX1cbiAgICAgICAgICAgIHRleHQ9eyhpKzEpLnRvU3RyaW5nKCl9XG4gICAgICAgICAgICBjdXJyZW50PXt0aGlzLnN0YXRlLmN1cnJlbnRQYWdlSW5kZXggPT09IGl9XG4gICAgICAgICAgICBjbGlja0hhbmRsZXI9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAgICAgLz5cbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpdGVtcy5wdXNoKFxuICAgICAgPFBHLkNvbXBvbmVudHMuUGFnaW5hdG9ySXRlbVxuICAgICAgICBrZXk9e3RoaXMucHJvcHMubnVtYmVyT2ZQYWdlcysxfVxuICAgICAgICB0eXBlPVwibmV4dFwiXG4gICAgICAgIHBhZ2VJbmRleD1cIitcIlxuICAgICAgICB0ZXh0PXt0aGlzLnByb3BzLm5leHRUZXh0fVxuICAgICAgICBkaXNhYmxlZD17dGhpcy5zdGF0ZS5jdXJyZW50UGFnZUluZGV4ID09PSB0aGlzLnByb3BzLm51bWJlck9mUGFnZXMgLSAxfVxuICAgICAgICBjbGlja0hhbmRsZXI9e3RoaXMuaGFuZGxlQ2xpY2t9XG4gICAgICAvPlxuICAgICk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHVsIGNsYXNzTmFtZT17Y2xhc3Nlc30+XG4gICAgICB7aXRlbXN9XG4gICAgICA8L3VsPlxuICAgICk7XG4gIH1cbn0pO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKSBtb2R1bGUuZXhwb3J0cyA9IFBHLkNvbXBvbmVudHMuUGFnaW5hdG9yO1xuIiwiUEcuQ29tcG9uZW50cy5UYWJJdGVtID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICBwcm9wVHlwZXM6IHtcbiAgICB0ZXh0OiBSZWFjdC5Qcm9wVHlwZXMuc3RyaW5nLFxuICAgIGluZGV4OiBSZWFjdC5Qcm9wVHlwZXMubnVtYmVyLFxuICAgIGFjdGl2ZTogUmVhY3QuUHJvcFR5cGVzLmJvb2wsXG4gICAgYmFkZ2U6IFJlYWN0LlByb3BUeXBlcy5zdHJpbmcsXG4gICAgY2xpY2tIYW5kbGVyOiBSZWFjdC5Qcm9wVHlwZXMuZnVuY1xuICB9LFxuXG4gIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24gZ2V0RGVmYXVsdFByb3BzKCkge1xuICAgIHJldHVybiB7XG4gICAgICB0ZXh0OiBcIlRhYiBJdGVtXCJcbiAgICB9O1xuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBpZiAodGhpcy5wcm9wcy5jbGlja0hhbmRsZXIpXG4gICAgICB0aGlzLnByb3BzLmNsaWNrSGFuZGxlcih0aGlzLnByb3BzLmluZGV4KTtcbiAgfSxcblxuICByZW5kZXI6IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG4gICAgICBcImFjdGl2ZVwiIDogdGhpcy5wcm9wcy5hY3RpdmVcbiAgICB9KTtcblxuICAgIHJldHVybiAoXG4gICAgICA8bGkgY2xhc3NOYW1lPXtjbGFzc2VzfT5cbiAgICAgICAgPGEgaHJlZj1cIiNcIiBvbkNsaWNrPXt0aGlzLmhhbmRsZUNsaWNrfT57dGhpcy5wcm9wcy50ZXh0fVxuICAgICAgICB7dGhpcy5nZXRCYWRnZSgpfVxuICAgICAgICA8L2E+XG4gICAgICA8L2xpPlxuICAgICk7XG4gIH0sXG5cbiAgZ2V0QmFkZ2U6IGZ1bmN0aW9uIGdldEJhZGdlKCkge1xuICAgIGlmICghdGhpcy5wcm9wcy5iYWRnZSkgcmV0dXJuO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImJhZGdlXCI+e3RoaXMucHJvcHMuYmFkZ2V9PC9zcGFuPlxuICAgICk7XG4gIH1cbn0pO1xuXG5pZih0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiKSBtb2R1bGUuZXhwb3J0cyA9IFBHLkNvbXBvbmVudHMuVGFiSXRlbTtcbiIsIlBHLkNvbXBvbmVudHMuVGFicyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgcHJvcFR5cGVzOiB7XG4gICAgaXRlbXM6IFJlYWN0LlByb3BUeXBlcy5hcnJheSxcbiAgICBhY3RpdmVJbmRleDogUmVhY3QuUHJvcFR5cGVzLm51bWJlcixcbiAgICBwaWxsczogUmVhY3QuUHJvcFR5cGVzLmJvb2xcbiAgfSxcblxuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIGdldERlZmF1bHRQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgaXRlbXM6IFtdLFxuICAgICAgYWN0aXZlSW5kZXg6IDBcbiAgICB9O1xuICB9LFxuXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGFjdGl2ZUluZGV4OiB0aGlzLnByb3BzLmFjdGl2ZUluZGV4XG4gICAgfTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICBpZiAobmV4dFByb3BzLmFjdGl2ZUluZGV4KVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICAgIGFjdGl2ZUluZGV4OiBuZXh0UHJvcHMuYWN0aXZlSW5kZXhcbiAgICAgIH0pO1xuICB9LFxuXG4gIGhhbmRsZUNsaWNrOiBmdW5jdGlvbihpbmRleCkge1xuICAgIGlmICh0aGlzLnByb3BzLmNsaWNrSGFuZGxlcilcbiAgICAgIHRoaXMucHJvcHMuY2xpY2tIYW5kbGVyKGluZGV4KTtcblxuICAgIHRoaXMuc2V0U3RhdGUoe1xuICAgICAgYWN0aXZlSW5kZXg6IGluZGV4XG4gICAgfSk7XG4gIH0sXG5cbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2xhc3NlcyA9IFJlYWN0LmFkZG9ucy5jbGFzc1NldCh7XG4gICAgICBcInRhYnNcIiA6IHRydWUsXG4gICAgICBcInBpbGxzXCIgOiB0aGlzLnByb3BzLnBpbGxzXG4gICAgfSk7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPHVsIGNsYXNzTmFtZT17Y2xhc3Nlc30+XG4gICAgICB7dGhpcy5wcm9wcy5pdGVtcy5tYXAoZnVuY3Rpb24oaXRlbSwgaW5kZXgpe1xuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8UEcuQ29tcG9uZW50cy5UYWJJdGVtXG4gICAgICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgICAgIHRleHQ9e2l0ZW0udGV4dH1cbiAgICAgICAgICAgICAgaW5kZXg9e2luZGV4fVxuICAgICAgICAgICAgICBhY3RpdmU9e3RoaXMuc3RhdGUuYWN0aXZlSW5kZXggPT09IGluZGV4fVxuICAgICAgICAgICAgICBiYWRnZT17aXRlbS5iYWRnZX1cbiAgICAgICAgICAgICAgY2xpY2tIYW5kbGVyPXt0aGlzLmhhbmRsZUNsaWNrfS8+XG4gICAgICAgICAgKX0uYmluZCh0aGlzKVxuICAgICAgKX1cbiAgICAgICAgPGxpIHRhYkluZGV4PVwiLTFcIj48L2xpPlxuICAgICAgPC91bD5cbiAgICApO1xuICB9XG59KTtcblxuaWYodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikgbW9kdWxlLmV4cG9ydHMgPSBQRy5Db21wb25lbnRzLlRhYnM7XG5cblxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9