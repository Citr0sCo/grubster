module.exports = {
    'root': true,
    'overrides': [
        {
            'files': [
                '*.ts'
            ],
            'parser': '@typescript-eslint/parser',
            'parserOptions': {
                'ecmaVersion': 2021,
                'sourceType': 'module',
                'project': './tsconfig.eslint.json'
            },
            'env': {
                'browser': true,
                'es2021': true,
                'es6': true,
                'jest': true
            },
            'plugins': [
                '@typescript-eslint',
                'ban',
                'import',
                'rxjs-angular',
                'rxjs',
                '@angular-eslint',
                'unicorn'
            ],
            'extends': [
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'plugin:@typescript-eslint/recommended-requiring-type-checking',
                'plugin:import/errors',
                'plugin:import/warnings',
                'plugin:import/typescript',
                'plugin:@angular-eslint/recommended'
            ],
            'rules': {
                'curly': 'error',
                'default-case-last': 'error',
                'dot-notation': 'off',
                '@typescript-eslint/dot-notation': [
                    'error'
                ],
                'eqeqeq': 'error',
                'grouped-accessor-pairs': 'error',
                'no-constructor-return': 'error',
                'no-empty-function': 'error',
                'no-eval': 'error',
                'no-implicit-globals': 'error',
                'no-new-wrappers': 'error',
                'no-sequences': 'error',
                'no-throw-literal': 'off',
                '@typescript-eslint/no-throw-literal': [
                    'error'
                ],
                'no-warning-comments': 'warn',
                'no-duplicate-imports': 'off',
                'import/no-duplicates': [
                    'error'
                ],
                'no-var': 'error',
                'prefer-arrow-callback': 'error',
                'prefer-const': 'error',
                'prefer-rest-params': 'error',
                'prefer-spread': 'error',
                'prefer-template': 'error',
                'no-alert': 'warn',
                'no-invalid-this': 'off',
                'no-useless-constructor': 'off',
                '@typescript-eslint/no-useless-constructor': [
                    'error'
                ],
                'no-redeclare': 'off',
                '@typescript-eslint/no-redeclare': [
                    'error'
                ],
                '@typescript-eslint/no-invalid-this': [
                    'error'
                ],
                '@typescript-eslint/array-type': [
                    'error',
                    {
                        'default': 'generic',
                        'readonly': 'generic'
                    }
                ],
                'no-shadow': 'off',
                '@typescript-eslint/no-shadow': 'error',
                '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
                '@typescript-eslint/no-floating-promises': 'warn',
                '@typescript-eslint/restrict-template-expressions': 'warn',
                '@typescript-eslint/explicit-function-return-type': [
                    'error',
                    {
                        'allowExpressions': true
                    }
                ],
                '@typescript-eslint/explicit-member-accessibility': [
                    'error',
                    {
                        'accessibility': 'explicit',
                        'overrides': {
                            'constructors': 'no-public'
                        }
                    }
                ],
                '@typescript-eslint/member-ordering': 'error',
                '@typescript-eslint/method-signature-style': 'error',
                '@typescript-eslint/no-invalid-void-type': 'error',
                '@typescript-eslint/no-unnecessary-condition': 'warn',
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        'selector': 'typeLike',
                        'format': [
                            'PascalCase'
                        ],
                        'leadingUnderscore': 'forbid',
                        'trailingUnderscore': 'forbid'
                    },
                    {
                        'selector': 'enumMember',
                        'format': [
                            'UPPER_CASE'
                        ],
                        'leadingUnderscore': 'forbid',
                        'trailingUnderscore': 'forbid'
                    },
                    {
                        'selector': 'variableLike',
                        'format': [
                            'camelCase'
                        ],
                        'leadingUnderscore': 'allow',
                        'trailingUnderscore': 'forbid'
                    },
                    {
                        'selector': 'property',
                        'modifiers': [
                            'private'
                        ],
                        'format': [
                            'camelCase'
                        ],
                        'leadingUnderscore': 'require',
                        'trailingUnderscore': 'forbid'
                    },
                    {
                        'selector': 'variable',
                        'modifiers': [
                            'const',
                            'exported'
                        ],
                        'format': [
                            'camelCase',
                            'UPPER_CASE',
                            'PascalCase'
                        ]
                    }
                ],
                '@typescript-eslint/parameter-properties': 'error',
                '@typescript-eslint/no-require-imports': 'error',
                '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
                '@typescript-eslint/prefer-for-of': 'error',
                '@typescript-eslint/prefer-includes': 'error',
                '@typescript-eslint/prefer-ts-expect-error': 'error',
                '@typescript-eslint/prefer-literal-enum-member': 'error',
                '@typescript-eslint/prefer-nullish-coalescing': 'error',
                '@typescript-eslint/prefer-optional-chain': 'error',
                '@typescript-eslint/prefer-reduce-type-parameter': 'error',
                '@typescript-eslint/no-unsafe-assignment': 'warn',
                '@typescript-eslint/no-unsafe-call': 'warn',
                '@typescript-eslint/no-unsafe-member-access': 'warn',
                '@typescript-eslint/no-unsafe-return': 'warn',
                '@typescript-eslint/no-unsafe-argument': 'warn',
                '@typescript-eslint/strict-boolean-expressions': 'warn',
                '@typescript-eslint/unbound-method': 'warn',
                '@typescript-eslint/no-inferrable-types': 'warn',
                '@typescript-eslint/no-non-null-assertion': 'warn',
                '@typescript-eslint/prefer-readonly': 'error',
                'no-unused-vars': 'off',
                '@typescript-eslint/no-unused-vars': 'warn',
                'ban/ban': [
                    'error',
                    {
                        'name': 'setTimeout',
                        'message': 'Please use RXJS timer or delay'
                    },
                    {
                        'name': 'setInterval',
                        'message': 'Please use RXJS interval'
                    }
                ],
                'import/no-unresolved': [
                    'off'
                ],
                'no-restricted-imports': [
                    'error',
                    {
                        'patterns': [
                            '../**/*-view.module'
                        ]
                    }
                ],
                'import/no-restricted-paths': [
                    'error',
                    {
                        'zones': [
                            {
                                'target': './app/Web/modules',
                                'from': './app/Web',
                                'except': [
                                    './modules'
                                ],
                                'message': 'Modules should not import files outside modules. You will need to pull the code needed into modules so that it can be used and shared with other modules.'
                            },
                            {
                                'target': './app/Web/app',
                                'from': './app/Web',
                                'except': [
                                    './app'
                                ],
                                'message': 'Please use @modules/* to import files from modules.'
                            },
                            {
                                'target': './app/Web/core',
                                'from': './app/Web',
                                'except': [
                                    './core'
                                ],
                                'message': 'Core should not import files outside core.'
                            }
                        ]
                    }
                ],
                'rxjs/no-nested-subscribe': 'warn',
                'rxjs/no-internal': 'error',
                'no-restricted-syntax': [
                    'error',
                    {
                        'selector': 'MethodDefinition[kind=constructor] Identifier[name=subscribe]',
                        'message': 'Subscriptions need to be in ngOnInit method'
                    }
                ],
                '@angular-eslint/contextual-decorator': 'error',
                '@angular-eslint/no-lifecycle-call': 'error',
                '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
                '@angular-eslint/no-input-prefix': 'error',
                '@angular-eslint/prefer-output-readonly': 'error',
                '@angular-eslint/relative-url-prefix': 'error',
                '@angular-eslint/no-host-metadata-property': 'off',
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        'type': [
                            'element',
                            'attribute'
                        ],
                        'prefix': 'bl',
                        'style': 'kebab-case'
                    }
                ],
                'unicorn/filename-case': [
                    'error',
                    {
                        'case': 'kebabCase'
                    }
                ],
                'unicorn/no-array-for-each': 'error',
                'unicorn/no-lonely-if': 'error',
                'unicorn/no-new-buffer': 'error',
                'unicorn/no-unsafe-regex': 'warn',
                'unicorn/prefer-add-event-listener': 'error',
                'unicorn/prefer-array-find': 'error',
                'unicorn/prefer-array-some': 'error',
                'unicorn/prefer-includes': 'error',
                'unicorn/prefer-modern-dom-apis': 'error'
            }
        },
        {
            'files': [
                '*.html'
            ],
            'plugins': [
                '@angular-eslint'
            ],
            'extends': [
                'plugin:@angular-eslint/template/recommended'
            ],
            'rules': {
                '@angular-eslint/template/accessibility-alt-text': 'error',
                '@angular-eslint/template/accessibility-elements-content': 'error',
                '@angular-eslint/template/accessibility-label-for': 'error',
                '@angular-eslint/template/accessibility-tabindex-no-positive': 'error',
                '@angular-eslint/template/accessibility-valid-aria': 'error',
                '@angular-eslint/template/click-events-have-key-events': 'error',
                '@angular-eslint/template/mouse-events-have-key-events': 'error',
                '@angular-eslint/template/no-call-expression': 'error',
                '@angular-eslint/template/no-any': 'error',
                '@angular-eslint/template/use-track-by-function': 'warn'
            }
        }
    ]
};
