package main

import (
	"net/http"

	"github.com/gin-contrib/multitemplate"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	renderer := multitemplate.NewRenderer()
	renderer.AddFromFiles("index", "templates/index.tmpl")
	router.HTMLRender = renderer

	router.GET("/", func(c *gin.Context) {
		c.Redirect(http.StatusMovedPermanently, "index.html")
	})
	router.GET("/index.html", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index", map[string]interface{}{
			"Test": "hullo!",
		})
	})
	router.Static("/static", "./static")

	router.Run("0.0.0.0:80")
}
