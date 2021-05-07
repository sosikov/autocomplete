import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from '../../helpers'
import './Autocomplete.css'

const Autocomplete = memo(({ label, getOptions, onChange }) => {
  const [state, setState] = useState({
    value: '',
    loading: false,
    options: [],
    selected: null,
    expanded: false,
    cache: {},
    error: false,
    focused: null,
  })

  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  const handleChange = ({ target: { value } }) => {
    if (!value) {
      setState({
        ...state,
        selected: null,
        options: [],
        expanded: false,
        error: false,
        focused: null,
      })
      return
    }

    setState({
      ...state,
      value,
      loading: true,
      options: [],
      selected: null,
      expanded: false,
      error: false,
      focused: null,
    })
  }

  const getCached = useCallback(() => {
    setState({
      ...state,
      options: state.cache[state.value],
      loading: false,
      expanded: true,
    })
  }, [state])

  const handleBlur = () => {
    state.expanded && setState({
      ...state,
      expanded: false,
    })
  }

  useEffect(() => {
    if (state.loading && state.value) {
      if (state.cache[state.value]) {
        return getCached()
      }

      getOptions(state.value)
        .then((options) => {
          setState({
            ...state,
            options,
            loading: false,
            expanded: true,
            cache: {
              ...state.cache,
              [state.value]: options,
            },
          })
        })
        .catch(() => {
          setState({
            ...state,
            options: [],
            loading: false,
            expanded: false,
            selected: null,
            error: true,
          })
        })
    }
  }, [state, getOptions, getCached])

  useEffect(() => {
    if (state.selected) {
      onChange(state.selected)
    }
  }, [state.selected, onChange])

  const handleSelect = (option) => () => {
    setState({
      ...state,
      selected: option,
      expanded: false,
    })

    inputRef.current.value = option.name
  }

  const handleClear = () => {
    setState({
      ...state,
      value: '',
      loading: false,
      options: [],
      selected: null,
      expanded: false,
      error: false,
    })

    inputRef.current.value = ''
  }

  const handleExpand = () => {
    if (state.options.length && !state.expanded) {
      setState({
        ...state,
        expanded: true,
      })
    }
  }

  const handleKeydown = ({ which }) => {
    if (which === 27) {
      setState({
        ...state,
        expanded: false,
      })
    }

    if (which === 40) {
      if (state.focused < state.options.length - 1) {
        setState({
          ...state,
          focused: state.focused === null ? 0 : state.focused + 1,
        })
      }
    }

    if (which === 38) {
      if (state.focused !== state.options.length && state.focused !== 0) {
        setState({
          ...state,
          focused: state.focused - 1,
        })
      }
    }

    if (which === 13) {
      handleSelect(state.options[state.focused])()
    }
  }

  const highlight = (option) => {
    const node = new XMLSerializer().serializeToString(document.createTextNode(option))
    return {
      __html: node.replace(new RegExp(state.value, 'gi'), (match) => `<b>${match}</b>`),
    }
  }
  
  const getClasses = (index) => {
    let classes = 'autocomplete__option'
    if (index === state.focused) {
      classes += ' autocomplete__option--hovered'
    }
    return classes
  }

  const debouncedHandleChange = debounce(handleChange, 1000)

  return (
    <div className="autocomplete" ref={wrapperRef}>
      {
        label && <span className="autocomplete__label">{label}</span>
      }
      <div className="autocomplete__form">
        <input
          ref={inputRef}
          className="autocomplete__input"
          onChange={debouncedHandleChange}
          onClick={handleExpand}
          onKeyDown={handleKeydown}
          onBlur={handleBlur}
        />
        {
          state.loading && <span className="autocomplete__spinner" />
        }
        {
          state.selected && (
            <span
              className="autocomplete__cross"
              onClick={handleClear}>
              &#x2715;
            </span>
          )
        }
      </div>
      {
        state.options.length > 0 && state.expanded && (
          <ul className="autocomplete__options">
            {
              state.options.map((option, index) => {
                return (
                  <li
                    key={option.code}
                    className={getClasses(index)}
                    onMouseDown={handleSelect(option)}
                    dangerouslySetInnerHTML={highlight(option.name)}
                  />
                )
              })
            }
          </ul>
        )
      }
      {
       state.options.length === 0 && state.expanded && (
          <ul className="autocomplete__options">
            <li className="autocomplete__option">
              {
                state.error ? 'Request error' : 'Not found'
              }
            </li>
          </ul>
        )
      }
    </div>
  )
})

export default Autocomplete
