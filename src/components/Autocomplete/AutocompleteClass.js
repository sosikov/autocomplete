import React, { Component } from 'react'
import { debounce } from '../../helpers'
import './Autocomplete.css'

class AutoComplete extends Component {
  constructor() {
    super()

    this.handleChange = this.handleChange.bind(this)
    this.getCached = this.getCached.bind(this)
    this.handleBlur = this.handleBlur.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handleExpand = this.handleExpand.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.highlight = this.highlight.bind(this)
    this.getClasses = this.getClasses.bind(this)

    this.state = {
      value: '',
      loading: false,
      options: [],
      selected: null,
      expanded: false,
      cache: {},
      error: false,
      focused: null,
    }

    this.debouncedHandleChange = debounce(this.handleChange, 1000)

    this.inputRef = React.createRef()
    this.wrapperRef = React.createRef()
    this.anchorRef = React.createRef()
  }

  componentDidUpdate(_prevProps, prevState) {
    const { getOptions, onChange } = this.props

    if (this.state.loading && this.state.value) {
      if (this.state.cache[this.state.value]) {
        return this.getCached()
      }

      getOptions(this.state.value)
        .then((options) => {
          this.setState({
            options,
            loading: false,
            expanded: true,
            cache: {
              ...this.state.cache,
              [this.state.value]: options,
            },
          })
        })
        .catch(() => {
          this.setState({
            options: [],
            loading: false,
            expanded: false,
            selected: null,
            error: true,
          })
        })
    }

    if (this.state.focused !== null && this.anchorRef.current) {
      this.anchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }

    if (this.state.selected && prevState.selected !== this.state.selected) {
      onChange(this.state.selected)
    }
  }

  handleChange({ target: { value } }) {
    if (!value) {
      this.setState({
        selected: null,
        options: [],
        expanded: false,
        error: false,
        focused: null,
      })
      return
    }

    this.setState({
      value,
      loading: true,
      options: [],
      selected: null,
      expanded: false,
      error: false,
      focused: null,
    })
  }

  getCached() {
    this.setState({
      options: this.state.cache[this.state.value],
      loading: false,
      expanded: true,
    })
  }

  handleBlur() {
    this.state.expanded && this.setState({
      expanded: false,
    })
  }

  handleSelect(option) {
    return () => {
      this.setState({
        selected: option,
        expanded: false,
      })
  
      this.inputRef.current.value = option.name
    }
  }

  handleClear() {
    this.setState({
      value: '',
      loading: false,
      options: [],
      selected: null,
      expanded: false,
      error: false,
    })

    this.inputRef.current.value = ''
  }

  handleExpand() {
    if (this.state.options.length && !this.state.expanded) {
      this.setState({
        expanded: true,
      })
    }
  }

  handleKeydown({ which }) {
    if (which === 27) {
      this.setState({
        expanded: false,
      })
    }

    if (which === 40) {
      if (this.state.focused < this.state.options.length - 1) {
        this.setState({
          focused: this.state.focused === null ? 0 : this.state.focused + 1,
        })
      }
    }

    if (which === 38) {
      if (this.state.focused !== this.state.options.length && this.state.focused !== 0) {
        this.setState({
          focused: this.state.focused - 1,
        })
      }
    }

    if (which === 13) {
      this.handleSelect(this.state.options[this.state.focused])()
    }
  }

  highlight(option) {
    const node = new XMLSerializer().serializeToString(document.createTextNode(option))
    return {
      __html: node.replace(new RegExp(this.state.value, 'gi'), (match) => `<b>${match}</b>`),
    }
  }

  getClasses(index) {
    let classes = 'autocomplete__option'
    if (index === this.state.focused) {
      classes += ' autocomplete__option--hovered'
    }
    return classes
  }

  render() {
    const { label } = this.props

    return (
      <div className="autocomplete" ref={this.wrapperRef}>
        {
          label && <span className="autocomplete__label">{label}</span>
        }
        <div className="autocomplete__form">
          <input
            ref={this.inputRef}
            className="autocomplete__input"
            onChange={this.debouncedHandleChange}
            onClick={this.handleExpand}
            onKeyDown={this.handleKeydown}
            onBlur={this.handleBlur}
          />
          {
            this.state.loading && <span className="autocomplete__spinner" />
          }
          {
            this.state.selected && (
              <span
                className="autocomplete__cross"
                onClick={this.handleClear}>
                &#x2715;
              </span>
            )
          }
        </div>
        {
          this.state.options.length > 0 && this.state.expanded && (
            <ul className="autocomplete__options">
              {
                this.state.options.map((option, index) => {
                  return (
                    <li
                      key={option.code}
                      ref={index === this.state.focused ? this.anchorRef : null}
                      className={this.getClasses(index)}
                      onMouseDown={this.handleSelect(option)}
                      dangerouslySetInnerHTML={this.highlight(option.name)}
                    />
                  )
                })
              }
            </ul>
          )
        }
        {
         this.state.options.length === 0 && this.state.expanded && (
            <ul className="autocomplete__options">
              <li className="autocomplete__option">
                {
                  this.state.error ? 'Request error' : 'Not found'
                }
              </li>
            </ul>
          )
        }
      </div>
    )
  }
}

export default AutoComplete
