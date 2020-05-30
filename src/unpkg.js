import React, { ReactDOM, useState } from 'https://unpkg.com/es-react'
import htm from 'https://unpkg.com/htm?module'
import css from 'https://unpkg.com/csz?module'
import * as mobx from 'https://unpkg.com/mobx@5.15.4/lib/mobx.module.js'
import * as mobxReact from './modules/mobx-react.js'
import * as kjv from 'https://unpkg.com/es-kjv@1.0.2'

const html = htm.bind(React.createElement)

export { React, ReactDOM, useState, htm, html, css, mobx, mobxReact, kjv }
