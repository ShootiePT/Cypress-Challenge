describe('template spec', () => {
  beforeEach(() => {
    cy.visit('https://www.leyaonline.com/pt/')
    cy.get("#cookiescript_accept").click()
  })
  
  it('Scenario 1', () => {
    cy.get('#searchbar-large').type('George').trigger('keydown',{key: 'Enter'});
    cy.get('div.book-card-container .book-card').contains('O Triunfo dos Porcos').click();
    cy.get('section.sinopse').contains('Quinta Manor');
  })

  it('Scenario 2', () => {
    cy.get('#searchbar-large').type('1984').trigger('keydown',{key: 'Enter'});
    cy.get('div.book-card-container .book-card').contains('1984').contains('George Orwell', {matchCase: false}).click();
    cy.get('div._sinpose-address').contains('li','ISBN:').then(($value) => {
      let getText = $value.text();
      //cy.log(getText);
      expect(9789722071550).equal(parseInt(getText.split(': ')[1]));
    })

    cy.get('div._sinpose-address').contains('li','Páginas:').then(($value) => {
      let getText = $value.text();
      expect(344).equal(parseInt(getText.split(': ')[1]));
    })

    cy.get('div._sinpose-address').contains('li','Dimensões:').then(($value) => {
      let getText = $value.text();
      let cleanedText = getText.replace(/\s+/g, ' ').trim();
      let result = cleanedText.split(': ')[1];
      expect(result).equal('235 x 157 x 23 mm');
    })
  })

  it('Scenario 3', () => {
    let authorOne = '';
    let authorTwo = '';

    cy.get('#searchbar-large').type('1984').trigger('keydown',{key: 'Enter'});
    cy.get('div.book-card-container .book-card').contains('1984').click();
    cy.get('section.author .author-info .leya_h2').then(($div) => {
      //cy.log($div);
      authorOne = $div.text();
      cy.log(authorOne);
    })

    cy.get('#searchbar-large').type('A Quinta dos Animais').trigger('keydown',{key: 'Enter'});
    cy.get('div.book-card-container .book-card').contains('A Quinta dos Animais');
    cy.get('section.author .author-info .leya_h2').then(($div) => {
      authorTwo = $div.text();
      cy.log(authorTwo);
    })

    cy.then(() => {
      expect(authorOne.toLowerCase()).equal(authorTwo.toLowerCase());
    });
  })

  it('Scenario 4', () => {

    cy.get('#searchbar-large').type('1984').trigger('keydown',{key: 'Enter'});
    cy.get('div.book-card-container .book-card').contains('1984').click();
    cy.get('section.banner .choose-options .ebook .buy-button').click();

    cy.wait(1000);
    cy.get('header .add-to-cart a').then(($element) => {
      let dataTagValue = parseInt($element.attr('data-tag'));
      //cy.log('Data Tag Value: ' + dataTagValue);
      expect(dataTagValue).equal(1);
    });
  })

  it('Scenario 5', () => {

    cy.get('header #darkmode').click();

    cy.get('#darkmode .nav-icon').then( ($el) => {
      //cy.log($el[0].className);
      return $el[0].className;
    }).should('match', /icon-moon/);
  })

  it('Scenario 6: list all free ebooks', () => {

    cy.get('header .icon-hamburguer').click();
    cy.get('.offcanvas-menu-item li a').each(($el) => {
      //cy.log($el.text());
      if ($el.text().toLowerCase() === 'ebooks') {
        //cy.log('click');
        cy.wrap($el).click();
      }
    })

    cy.get('.search-filter-btn').click();
    cy.get('.fechar-filter-content .filter-item a').each(($el) => {
      let t = $el.text().toLowerCase().trim();
      if (t === 'gratuitos') {
        cy.wrap($el).click();
      }
    })
  })

  it('Scenario 7: add two books to checkout and then remove them', () => {
    let bookOne = "1984";
    let bookTwo = "O Pequeno Navio";

    cy.get('#searchbar-large').type(bookOne).trigger('keydown',{key: 'Enter'});
    cy.get('div.book-card-container .book-card').contains(bookOne).click();
    cy.get('section.banner .choose-options .ebook .buy-button').click();

    cy.get('header .icon-hamburguer').click();
    cy.get('.offcanvas-menu-item li a').each(($el) => {
      if ($el.text().toLowerCase() === 'livros') {
        cy.wrap($el).click();
      }
    })

    cy.get('div.book-card-container .book-card').contains(bookTwo).parent().contains('Comprar').click();
    cy.get('.dropdown-menu-right .checkout-btn a').click();
    cy.get('.remove-product').each(($el) => {
      cy.wrap($el).click();
    })

    cy.get('.tab-content').should('not.contain', bookOne);
    cy.get('.tab-content').should('not.contain', bookTwo);
  })
})