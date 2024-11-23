describe('Unit Test Example', () => {
  it('should add two numbers correctly', () => {
    const result = 2 + 2;
    expect(result).toBe(4);
  });

  it('should concatenate strings', () => {
    const str1 = 'Hello';
    const str2 = 'World';
    const result = `${str1} ${str2}`;
    expect(result).toBe('Hello World');
  });
});
