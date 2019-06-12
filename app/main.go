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

func pageHtmlPaths() ([]string) {
	var pages []string
	err := filepath.Walk("pages", func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		if !info.IsDir() && strings.HasSuffix(info.Name(), ".html") {
			pages = append(pages, path)
		}
		return nil
	})
	if err != nil {
		panic(fmt.Errorf("could not read page files: %s", err.Error()))
	}
	return pages
}

func pageBundles(pageName string) ([]string, error) {
	staticFiles, err := ioutil.ReadDir("static/bundles")
	if err != nil {
		return nil, err
	}
	var bundles []string
	for _, f := range staticFiles {
		if !strings.HasSuffix(f.Name(), ".bundle.js") {
			continue
		}
		if f.Name() == pageName+".bundle.js" ||
			strings.Contains(f.Name(), "~"+pageName+"~") ||
			strings.Contains(f.Name(), "~"+pageName+".") {
			bundles = append(bundles, f.Name())
		}
	}
	return bundles, nil
}

func loadTemplates() render.HTMLRender {
	r := multitemplate.NewRenderer()

	layouts, err := filepath.Glob("common/*.html")
	if err != nil {
		panic(err)
	}

	for _, pageHtmlPath := range pageHtmlPaths() {
		templateName := filepath.Base(pageHtmlPath)
		pageName := templateName
		if strings.Contains(templateName, ".") {
			pageName = templateName[:strings.Index(templateName, ".")]
		}
		tmpl := template.Must(
			template.New(filepath.Base(layouts[0])).Funcs(map[string]interface{}{
				"PageBundles": func() ([]string, error) {
					return pageBundles(pageName)
				},
			}).ParseFiles(append(layouts, pageHtmlPath)...))
		r.Add(templateName, tmpl)
	}
	return r
}

func main() {
	router := gin.Default()
	renderer := loadTemplates()
	router.HTMLRender = renderer

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", map[string]interface{}{
			"Test": "hullo",
		})
	})

	for _, pageHtmlPath := range pageHtmlPaths() {
		pageDir := filepath.Dir(pageHtmlPath)
		pageName := filepath.Base(pageHtmlPath)
		if strings.Contains(pageName, ".") {
			pageName = pageName[:strings.Index(pageName, ".")]
		}
		router.GET("/"+pageName+".html", func(c *gin.Context) {
			c.HTML(http.StatusOK, pageName+".html", nil)
		})
		router.StaticFile("/"+pageName+".css", pageDir+"/"+pageName+".css")
	}

	router.Static("/static", "static")

	router.Run("0.0.0.0:8080")
}
