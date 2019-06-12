package main

import (
	"fmt"
	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/render"
	"html/template"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

func main() {
	router := gin.Default()
	renderer := loadTemplates()
	router.HTMLRender = renderer

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", map[string]interface{}{
			"Test": "hullo",
		})
	})

	router.GET("/:page", func(c *gin.Context) {
		page := strings.TrimSpace(filepath.Clean(c.Param("page")))
		if page != c.Param("page") {
			c.Redirect(http.StatusPermanentRedirect, page)
			return
		}
		pageName := page
		if strings.Contains(page, ".") {
			pageName = page[:strings.Index(page, ".")]
		}
		if strings.HasSuffix(page, ".html") {
			c.HTML(http.StatusOK, page, map[string]interface{}{})
			return
		}
		if strings.HasSuffix(page, ".css") {
			c.File("pages/" + pageName + "/" + pageName + ".css")
			return
		}
		if strings.HasSuffix(page, ".bundle.js") {
			c.Header("Content-Type", "text/javascript;charset=UTF-8")
			c.File("static/" + page)
			return
		}
	})

	router.Run("0.0.0.0:8080")
}

func pageBundles(pageName string) ([]string, error) {
	staticFiles, err := ioutil.ReadDir("static")
	if err != nil {
		return nil, err
	}
	var bundles []string
	for _, f := range staticFiles {
		if !strings.HasSuffix(f.Name(), ".bundle.js") {
			continue
		}
		if strings.Contains(f.Name(), "~"+pageName+"~") || strings.Contains(f.Name(), "~"+pageName+".") {
			bundles = append(bundles, f.Name())
		}
	}
	return bundles, nil
}

func loadTemplates() render.HTMLRender {
	r := multitemplate.NewRenderer()

	layouts, err := filepath.Glob("pages/common/*.html")
	if err != nil {
		panic(err)
	}

	var pages []string
	err = filepath.Walk("pages", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if info.IsDir() && info.Name() == "common" {
			return filepath.SkipDir
		}
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".html") {
			pages = append(pages, path)
		}
		return nil
	})
	if err != nil {
		panic(fmt.Errorf("could not read page files: %s", err.Error()))
	}

	for _, page := range pages {
		templateName := filepath.Base(page)
		pageName := templateName
		if strings.Contains(templateName, ".") {
			pageName = templateName[:strings.Index(templateName, ".")]
		}
		tmpl := template.Must(
			template.New(filepath.Base(layouts[0])).Funcs(map[string]interface{}{
				"PageBundles": func() ([]string, error) {
					return pageBundles(pageName)
				},
			}).ParseFiles(append(layouts, page)...))
		r.Add(templateName, tmpl)
	}
	return r
}
