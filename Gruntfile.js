/**
 * @file Grunt的task配置文件
 * @author fzcs
 * @copyright Dreamarts Corporation. All Rights Reserved.
 */

module.exports = function(grunt) {

  grunt.loadNpmTasks("grunt-contrib-less");   // 编译less，生成css文件
  grunt.loadNpmTasks("grunt-contrib-watch");  // 监视文件变更，并执行指定的task
  grunt.loadNpmTasks("grunt-contrib-jshint"); // 检查jshint
  grunt.loadNpmTasks("grunt-contrib-clean");  // 清楚临时文件
  grunt.loadNpmTasks("grunt-contrib-uglify"); // 压缩js文件
  grunt.loadNpmTasks("grunt-contrib-copy");   // 复制文件
  grunt.loadNpmTasks("grunt-jsdoc");          // 生成jsdoc文档
  grunt.loadNpmTasks("grunt-mocha-cli");      // Node单元测试
  grunt.loadNpmTasks("grunt-mocha-cov");      // 覆盖率
  grunt.loadNpmTasks("grunt-jscoverage");     // 生成统计覆盖率用的文件
  grunt.loadNpmTasks("grunt-plato");          // 分析代码复杂度，包括jshint等

  grunt.initConfig({

    /**
     * less 编译器
     */
    less: {
      development: {
        options: {
          paths: []
        },
        files: {
          "app/public/smartadmin/stylesheets/admin.css": "app/public/smartadmin/stylesheets/admin.less"
        }
      },
      production: {
        options: {
          paths: []
        , compress: true
        },
        files: {
          "app/public/smartadmin/stylesheets/admin.min.css": "app/public/smartadmin/stylesheets/admin.less"
        }
      }
    },

    /**
     * 监视文件变更（执行less编译）
     */
    watch: {
      less: {
        files: ["*.less", "app/public/smartadmin/stylesheets/*.less"]
      , tasks: ["less:development", "less:production"]
      , options : {
          livereload: true
        , nospawn: true
        }
      }
    },

    /**
     * 代码检查
     */
    jshint: {
      files: [
        "lib/**/*.js"
      , "app/admin/**/*.js"
      , "bin/**/*.js"
      , "test/cases/**/*.js"
      ]
    , options: {
        jshintrc: ".jshintrc"
      }
    },

    /**
     * 文档生成
     */
    jsdoc : {
      dist : {
        src: [
          "lib/**/*.js"
        ]
      , options: {
          destination: "docs"
        }
      }
    },

    /**
     * Mocha单元测试
     */
    mochacli: {
      options: {
        require: ["should"]
      , reporter: "nyan"
      , bail: true
      },
      all: [
        "test/cases/core/*.js"
      ]
    },

    /**
     * 生成coverage统计用代码
     */
    jscoverage: {
      options: {
        inputDirectory: "lib",
        outputDirectory: "test/coverage/lib"
      }
    },

    /**
     * 生成coverage报告
     */
    mochacov: {
      options: {
        reporter: "html-cov"
      , require: ["should"]
      },
      all: [
        "test/cases/core/models/test_mod_company.js"
      , "test/cases/core/models/test_mod_master.js"
      ]
    },

    /**
     * 清除临时数据
     */
    clean: [
      "test/coverage"
    , "docs"
    ],

    /**
     * 静态分析代码（结果生成到工程的reports目录下）
     */
    plato: {
      task: {
        options : {
          jshint : grunt.file.readJSON(".jshintrc")
        },
        files: {
          "reports": ["lib/**/*.js"]
        }
      }
    },

    /**
     * 压缩js文件
     */
    uglify: {
      target: {
        files: {
          "app/public/static/alertify.js": ["app/public/smart/alertify/alertify.js"],
          "app/public/static/bootstrap.js": ["app/public/smart/bootstrap/js/bootstrap.js"]
        }
      }
    },

    /**
     * 拷贝文件
     */
    copy: {
      main: {
        files: [{
          expand: true
        , cwd: "app/public/"
        , src: ["smart/**", "smartadmin/**"]
        , dest: "app/public/static"
        }]
      }
    }

  });

  grunt.registerTask("conv", ["jscoverage", "mochacov", "clean"]);
  grunt.registerTask("test", ["mochacli"]);
  grunt.registerTask("analyze", ["plato"]);
  grunt.registerTask("compress", ["uglify"]);

};
