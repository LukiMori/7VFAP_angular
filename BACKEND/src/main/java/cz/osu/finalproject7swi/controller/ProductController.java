package cz.osu.finalproject7swi.controller;

import cz.osu.finalproject7swi.model.dto.ProductDTO;
import cz.osu.finalproject7swi.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

  private final ProductService productService;

  public ProductController(ProductService productService) {
    this.productService = productService;
  }

  @GetMapping
  public ResponseEntity<Page<ProductDTO>> getAllProducts(
    @RequestParam(defaultValue = "") String search,
    @RequestParam(defaultValue = "name,asc") String sort,
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "12") int size
  ) {
    return ResponseEntity.ok(productService.getFilteredProducts(search, sort, page, size));
  }

  @GetMapping("/by-category/{categoryId}")
  public ResponseEntity<List<ProductDTO>> getProductsByCategory(@PathVariable Long categoryId) {
    return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
  }

  @GetMapping("/{productId}")
  public ResponseEntity<ProductDTO> getProductById(@PathVariable Long productId) {
    return ResponseEntity.ok(productService.getProductById(productId));
  }
}
