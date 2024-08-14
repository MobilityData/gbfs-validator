const validatorVersion = process.env.COMMIT_REF
  ? process.env.COMMIT_REF.substring(0, 7)
  : require('./package.json').version

module.exports = {
  openapi: '3.0.3',
  info: {
    title: 'GBFS Validator',
    version: `${validatorVersion}`
  },
  servers: [
    {
      url: 'https://gbfs-validator.netlify.app/.netlify/functions'
    }
  ],
  paths: {
    '/validator': {
      post: {
        summary: 'Validate a GBFS feed',
        description: 'Validate the GBFS feed according to passed options',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidatorRequest'
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'Validation result',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Validator'
                }
              }
            }
          },
          500: {
            description: 'Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/feed': {
      post: {
        summary: 'Get feed content',
        description: "Get content of all GBFS's files. Useful to avoid CORS errors.",
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/FeedRequest'
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'Feed content',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Feed'
                }
              }
            }
          },
          500: {
            description: 'Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    },
    '/validator-summary': {
      post: {
        summary: 'Get a summary of the validation results',
        description: 'Returns a summary from the validator\'s response, including grouped error details.',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ValidatorRequest'
              }
            }
          },
          required: true
        },
        responses: {
          200: {
            description: 'Validation summary',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ValidationSummary'
                }
              }
            }
          },
          500: {
            description: 'Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Error: {
        type: 'object'
      },
      Validator: {
        required: ['summary', 'files'],
        type: 'object',
        properties: {
          summary: {
            type: 'object'
          },
          files: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/ValidatedFile'
            }
          }
        }
      },
      ValidatedFile: {
        type: 'object',
        properties: {
          schema: {
            type: 'object'
          },
          errors: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/JSONError'
            }
          },
          url: {
            type: 'string'
          },
          version: {
            type: 'string'
          },
          recommanded: {
            type: 'boolean'
          },
          required: {
            type: 'boolean'
          },
          exists: {
            type: 'boolean'
          },
          file: {
            type: 'string'
          },
          hasErrors: {
            type: 'boolean'
          },
          errorsCount: {
            type: 'number'
          }
        },
        required: ['required', 'exists', 'file', 'hasErrors', 'errorsCount']
      },
      JSONError: {
        type: 'object',
        properties: {
          instancePath: {
            type: 'string'
          },
          schemaPath: {
            type: 'string'
          },
          keyword: {
            type: 'string'
          },
          params: {
            type: 'object'
          },
          message: {
            type: 'string'
          }
        }
      },
      ValidatorRequest: {
        required: ['url'],
        type: 'object',
        properties: {
          url: {
            type: 'string'
          },
          options: {
            type: 'object',
            properties: {
              freefloating: {
                type: 'boolean'
              },
              docked: {
                type: 'boolean'
              },
              version: {
                type: 'string'
              },
              auth: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string'
                  },
                  basicAuth: {
                    type: 'object',
                    properties: {
                      user: {
                        type: 'string'
                      },
                      password: {
                        type: 'string'
                      }
                    }
                  },
                  bearerToken: {
                    type: 'object',
                    properties: {
                      token: {
                        type: 'string'
                      }
                    }
                  },
                  oauthClientCredentialsGrant: {
                    type: 'object',
                    properties: {
                      user: {
                        type: 'string'
                      },
                      password: {
                        type: 'string'
                      },
                      tokenUrl: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      FeedRequest: {
        required: ['url'],
        type: 'object',
        properties: {
          url: {
            type: 'string'
          }
        }
      },
      Feed: {
        type: 'object',
        properties: {
          summary: {
            type: 'object'
          },
          gbfsResult: {
            type: 'object'
          },
          gbfsVersion: {
            type: 'string'
          },
          files: {
            type: 'array',
            items: {
              type: 'object'
            }
          }
        }
      },
      ValidationSummary: {
        type: 'object',
        properties: {
          summary: {
            type: 'object'
          },
          filesSummary: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                required: {
                  type: 'boolean'
                },
                exists: {
                  type: 'boolean'
                },
                file: {
                  type: 'string'
                },
                hasErrors: {
                  type: 'boolean'
                },
                errorsCount: {
                  type: 'number'
                },
                groupedErrors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      keyword: {
                        type: 'string'
                      },
                      message: {
                        type: 'string'
                      },
                      schemaPath: {
                        type: 'string'
                      },
                      count: {
                        type: 'number'
                      }
                    }
                  }
                }
              },
              required: ['required', 'exists', 'file', 'hasErrors', 'errorsCount']
            }
          }
        }
      }
    }
  }
}
