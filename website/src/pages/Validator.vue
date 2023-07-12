<script setup>
import { reactive, onMounted } from 'vue'

import Result from '../components/Result.vue'

const state = reactive({
  result: false,
  isValidating: false,
  url: '',
  options: {
    freefloating: false,
    docked: false,
    version: null,
    auth: {
      type: null,
      basicAuth: { user: null, password: null },
      bearerToken: { token: null },
      apiKey: { key: null },
      oauthClientCredentialsGrant: {
        user: null,
        password: null,
        tokenUrl: null
      }
    }
  },
  versions: [
    { value: null, text: 'auto-detection' },
    { value: '3.0-RC', text: 'v3.0-RC' },
    { value: '2.3', text: 'v2.3' },
    { value: '2.2', text: 'v2.2' },
    { value: '2.1', text: 'v2.1' },
    { value: '2.0', text: 'v2.0' },
    { value: '1.1', text: 'v1.1' },
    { value: '1.0', text: 'v1.0' }
  ],
  auths: [
    {
      value: null,
      text: 'none'
    },
    {
      value: 'basic_auth',
      text: 'Basic Auth'
    },
    {
      value: 'bearer_token',
      text: 'Bearer Token'
    },
    {
      value: 'api_key',
      text: 'API Key'
    },
    {
      value: 'oauth_client_credentials_grant',
      text: 'Oauth Client Credentials Grant'
    }
  ]
})

onMounted(() => {
  // When specifying ?url=https://example.com/gbfs.json, start
  // directly a validation
  const url_query_param = new URL(location.href).searchParams.get('url')
  if (url_query_param) {
    state.url = url_query_param
    valid()
  }
})

function valid() {
  state.result = false
  state.isValidating = true

  fetch('/.netlify/functions/validator', {
    method: 'POST',
    body: JSON.stringify({
      url: state.url,
      options: state.options
    })
  })
    .then((resp) => resp.json())
    .then((result) => {
      state.isValidating = false
      state.result = result

      updateURL()
    })
    .catch((result) => {
      state.isValidating = false
      state.result = result
    })
}

function updateURL() {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set('url', state.url)
  history.pushState(
    null,
    '',
    window.location.pathname + '?' + searchParams.toString()
  )
}
</script>

<template>
  <div>
    <b-row>
      <b-col>
        <b-form-input
          type="url"
          v-model="state.url"
          placeholder="https://exemple.com/gbfs.json"
        ></b-form-input>
      </b-col>
      <b-col class="flex-grow-0">
        <b-button @click="valid" variant="success" style="white-space: nowrap"
          >Validate me !</b-button
        >
      </b-col>
    </b-row>

    <b-card class="mt-4">
      <b-tabs content-class="mt-3">
        <b-tab title="Options" active>
          <b-form-group
            id="input-group-version"
            label="Version"
            label-for="input-version"
          >
            <b-form-select
              id="input-version"
              :options="state.versions"
              v-model="state.options.version"
            ></b-form-select>
          </b-form-group>

          <b-form-group
            id="input-group-requirement"
            label="Allows you to force files requirements"
            label-for="input-requirement"
            class="mt-3"
          >
            <b-form-checkbox
              id="input-freefloating"
              v-model="state.options.freefloating"
              >&nbsp;Free-floating</b-form-checkbox
            >
            <b-form-checkbox id="input-docked" v-model="state.options.docked"
              >&nbsp;Docked</b-form-checkbox
            >
          </b-form-group>
        </b-tab>
        <b-tab title="Authentification">
          <b-form-group
            id="input-group-auth"
            label="Authentification"
            label-for="input-auth"
            class="mb-3"
          >
            <b-form-select
              id="input-auth"
              :options="state.auths"
              v-model="state.options.auth.type"
            ></b-form-select>
          </b-form-group>

          <b-form-group
            id="input-group-basic_auth"
            label="Authentification"
            label-for="input-basic_auth"
            v-if="state.options.auth.type === 'basic_auth'"
          >
            <b-row>
              <b-col>
                <b-form-input
                  id="input-basic_auth-user"
                  placeholder="user"
                  v-model="state.options.auth.basicAuth.user"
                ></b-form-input>
              </b-col>
              <b-col>
                <b-form-input
                  id="input-basic_auth-password"
                  placeholder="password"
                  v-model="state.options.auth.basicAuth.password"
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>

          <b-form-group
            id="input-group-bearer_token"
            label="Authentification"
            label-for="input-bearer_token"
            v-if="state.options.auth.type === 'bearer_token'"
          >
            <b-form-input
              id="input-bearer_token"
              placeholder="token"
              v-model="state.options.auth.bearerToken.token"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-api_key"
            label="Authentification"
            label-for="input-api_key"
            v-if="state.options.auth.type === 'api_key'"
          >
            <b-form-input
              id="input-api_key"
              placeholder="key"
              v-model="state.options.auth.apiKey.key"
            ></b-form-input>
          </b-form-group>

          <b-form-group
            id="input-group-oauth_client_credentials_grant"
            label="Authentification"
            label-for="input-bearer_token"
            v-if="state.options.auth.type === 'oauth_client_credentials_grant'"
          >
            <b-row>
              <b-col>
                <b-form-input
                  id="input-oauth_client_credentials_grant-user"
                  placeholder="user"
                  v-model="state.options.auth.oauthClientCredentialsGrant.user"
                ></b-form-input>
              </b-col>
              <b-col>
                <b-form-input
                  id="input-oauth_client_credentials_grant-password"
                  placeholder="password"
                  v-model="
                    state.options.auth.oauthClientCredentialsGrant.password
                  "
                ></b-form-input>
              </b-col>
              <b-col>
                <b-form-input
                  id="input-oauth_client_credentials_grant-token_url"
                  placeholder="https://example.com/oauth/token"
                  v-model="
                    state.options.auth.oauthClientCredentialsGrant.tokenUrl
                  "
                ></b-form-input>
              </b-col>
            </b-row>
          </b-form-group>
        </b-tab>
      </b-tabs>
    </b-card>

    <Result :isValidating="state.isValidating" :result="state.result" />
  </div>
</template>
