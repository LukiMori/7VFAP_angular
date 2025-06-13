package cz.osu.finalproject7swi.service;

import cz.osu.finalproject7swi.model.dto.ProductDTO;
import cz.osu.finalproject7swi.model.entity.Product;
import cz.osu.finalproject7swi.model.repository.ProductRepository;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

  private final ProductRepository productRepository;

  public ProductService(ProductRepository productRepository) {
    this.productRepository = productRepository;
  }

  public List<ProductDTO> getProductsByCategory(Long categoryId) {
    return productRepository.findByCategory_Id(categoryId).stream()
      .map(this::toDto)
      .toList();
  }

  public ProductDTO getProductById(Long productId) {
    Product product = productRepository.findById(productId)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    return toDto(product);
  }

  public Page<ProductDTO> getFilteredProducts(String search, String sort, int page, int size) {
    String[] sortParts = sort.split(",");
    String sortBy = sortParts[0];
    boolean desc = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("desc");

    Pageable pageable = PageRequest.of(page, size);

    Page<Product> result;

    if (sortBy.equals("name")) {
      result = desc
        ? productRepository.searchProductsByNameDesc(search, pageable)
        : productRepository.searchProductsByNameAsc(search, pageable);
    } else {
      Sort sortObj = Sort.by(sortBy);
      if (desc) sortObj = sortObj.descending();
      Pageable sortedPageable = PageRequest.of(page, size, sortObj);
      result = productRepository.searchProducts(search, sortedPageable);
    }

    return result.map(this::toDto);
  }

  private ProductDTO toDto(Product product) {
    return new ProductDTO(
      product.getId(),
      product.getName(),
      product.getDescription(),
      product.getPrice(),
      product.getQuantityInStock(),
      product.getImageUrl(),
      product.getCategory().getId(),
      product.getBrand().getName()
    );
  }
}
