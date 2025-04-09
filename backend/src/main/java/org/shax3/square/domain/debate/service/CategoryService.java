package org.shax3.square.domain.debate.service;

import org.shax3.square.domain.debate.model.Category;
import org.shax3.square.domain.debate.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

	private final CategoryRepository categoryRepository;

	public Category getCategoryByName(String name) {
		return categoryRepository.findByName(name);
	}
}
